const jdown = require("jdown");
const R = require("ramda");

const {
  contentDir,
  isPublished,
  relatedSlugs,
  relatedPosts,
  injectRelatedPosts,
  postsToPostPages,
  rawDataToGetData,
  stripPostContents,
  stripRelatedPostsContent,
  injectRelatedPostAuthors,
  injectAuthor,
} = require("./static.config");

// state to load content to
let content;

beforeAll(async () => {
  // kinda assumes that contentDir is correct before testing it
  content = await jdown(contentDir);
});

test("contentDir is `./content`", () => {
  expect(contentDir).toBe("./content");
});

describe("isPublished()", () => {
  it("returns false if `publishedOn` is not presentl", () => {
    expect(isPublished({})).toBeFalsy();
  });

  it("returns false if `publishedOn` is present but null", () => {
    expect(isPublished({ publishedOn: null })).toBeFalsy();
  });

  it("returns true if `publishedOn` is not null", () => {
    expect(isPublished({ publishedOn: "2020-10-10" })).toBeTruthy();
  });
});

describe("relatedSlugs()", () => {
  it("returns empty array if `relatedSlugs` are not present", () => {
    expect(relatedSlugs({})).toEqual([]);
  });

  it("returns og array if `relatedSlugs` are present", () => {
    expect(
      relatedSlugs({
        data: {
          relatedSlugs: ["s1", "s2"],
        },
      })
    ).toEqual(["s1", "s2"]);
  });
});

describe("relatedPosts()", () => {
  const posts = [
    {
      data: {
        slug: 1,
        relatedSlugs: [2],
      },
    },
    {
      data: {
        slug: 2,
      },
    },
  ];

  it("returns empty array if no related slugs exist", () => {
    const post = posts[1];
    const related = relatedPosts(posts, post);

    expect(related).toEqual([]);
  });

  it("returns related posts if related slugs exist", () => {
    const post = posts[0];
    const related = relatedPosts(posts, post);

    expect(related).toBeInstanceOf(Array);
    expect(related).toHaveLength(1);
    expect(related[0]).toHaveProperty("data.slug", 2);
  });
});

describe("injectRelatedPosts()", () => {
  const posts = [
    {
      data: {
        slug: 1,
        relatedSlugs: [2],
      },
    },
    {
      data: {
        slug: 2,
      },
    },
  ];

  const injectFn = injectRelatedPosts(posts);

  it("injects empty array of no related slugs exist", () => {
    const post = posts[1];
    const injected = injectFn(post);

    expect(injected.data.relatedPosts).toEqual([]);
  });

  it("injects related array of related slugs exist", () => {
    const post = posts[0];
    const injected = injectFn(post);

    expect(injected.data.relatedPosts).toBeInstanceOf(Array);
    expect(injected.data.relatedPosts).toHaveLength(1);
    expect(injected.data.relatedPosts[0]).toHaveProperty("data.slug", 2);
  });

  it("maintains exisiting data post injection", () => {
    const post = posts[0];
    const injected = injectFn(post);

    expect(injected.data.relatedSlugs).toEqual([2]);
  });
});

describe("jdown()", () => {
  it("has posts", () => {
    expect(content).toHaveProperty("posts");
  });

  it("loads known posts", () => {
    expect(content.posts).toHaveProperty("2021ClayBricksVersusLegos");
    expect(content.posts).toHaveProperty(
      "2021HowToBuildAMetaverseLet’sStartWithTheBlocks"
    );
    expect(content.posts).toHaveProperty("2021WhatsUpBlockNovember20To262021");
  });

  it("loads post metadata", () => {
    const existingPost = content.posts["2021ClayBricksVersusLegos"];
    const expectedKeys = [
      "title",
      "subTitle",
      "slug",
      "canonicalUrl",
      "publishedOn",
      "heroImg",
      "tags",
      "relatedSlugs",
      "author",
      "contents",
    ];

    R.forEach((k) => {
      expect(existingPost).toHaveProperty(k);
    }, expectedKeys);
  });

  test("relatedSlugs and tags are arrays", () => {
    const existingPost = content.posts["2021ClayBricksVersusLegos"];

    expect(existingPost.tags).toBeInstanceOf(Array);
    expect(existingPost.relatedSlugs).toBeInstanceOf(Array);
  });

  it("has tags", () => {
    expect(content).toHaveProperty("tags");
  });

  it("has authors", () => {
    expect(content).toHaveProperty("authors");
  });

  it("loads author metadata", () => {
    const me = content.authors["shivekKhurana"];
    const requiredKeys = [
      "slug",
      "name",
      "profilePicture",
      "shortBio",
      "contents",
    ];

    R.forEach((k) => {
      expect(me).toHaveProperty(k);
    }, requiredKeys);
  });
});

describe("postsToPostPages()", () => {
  const postPages = postsToPostPages([{ slug: "test-slug", flag: "x" }]);

  it("returns RS meta data", () => {
    const first = postPages[0];
    expect(first).toHaveProperty("path", "/blog/test-slug");
    expect(first).toHaveProperty("template", "src/templates/blog/Post");
    expect(first).toHaveProperty("data");
    expect(first.data).toHaveProperty("flag", "x");
  });
});

describe("stipPostContents()", () => {
  const post = { data: { contents: "x" } };
  it("strips contents from data", () => {
    expect(stripPostContents(post)).not.toHaveProperty("data.contents");
  });
});

describe("stripRelatedPostsContent()", () => {
  const post = {
    data: {
      relatedPosts: [
        {
          data: { contents: "x" },
        },
        {
          data: { contents: "y" },
        },
      ],
    },
  };

  it("strips contents of related posts", () => {
    const stripped = stripRelatedPostsContent(post);
    expect(stripped).not.toHaveProperty("data.relatedPosts.0.data.contents");
    expect(stripped).not.toHaveProperty("data.relatedPosts.1.data.contents");
  });
});

describe("rawDataToGetData()", () => {
  const post = { data: "x" };
  const withGetData = rawDataToGetData(post);

  it("converts data to a getData fn", () => {
    expect(withGetData.getData).toBeInstanceOf(Function);
    expect(withGetData.getData()).toEqual(post.data);
  });
});

describe("injectRelatedPostauthors()", () => {
  const authors = {
    x: { slug: "x", id: 1, data: "x-data" },
    y: { slug: "y", id: 2, data: "y-data" },
  };

  const post = {
    data: {
      relatedPosts: [
        {
          data: {
            author: "x",
          },
        },
        {
          data: {
            author: "y",
          },
        },
      ],
    },
  };

  const withAuthors = injectRelatedPostAuthors(authors)(post);

  it("should inject author data in place of author slug", () => {
    expect(withAuthors.data.relatedPosts).toBeInstanceOf(Array);
    expect(withAuthors.data.relatedPosts).toHaveLength(2);

    const first = withAuthors.data.relatedPosts[0];
    const second = withAuthors.data.relatedPosts[1];

    expect(first).toHaveProperty("data.author", authors.x);
    expect(second).toHaveProperty("data.author", authors.y);
  });
});

describe("injectAuthor()", () => {
  const authors = [
    { slug: "x", contents: "x contents", name: "xname" },
    { slug: "y", contents: "yc" },
  ];

  const post = { data: { author: "x" } };
  const injectFn = injectAuthor(authors);

  const injectedPost = injectFn(post);

  it("replaces author slug with author in post", () => {
    expect(injectedPost).toHaveProperty("data.author.slug", "x");
    expect(injectedPost).toHaveProperty("data.author.name", "xname");
  });
  it("strips author contents before injection", () => {
    expect(injectedPost).not.toHaveProperty("data.author.contents");
  });
});
