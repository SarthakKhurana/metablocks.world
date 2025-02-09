import React, { useEffect } from "react";
import { useRouteData } from "react-static";
import { Link, useLocation } from "react-router-dom";
import convert from "htmr";

import colors from "../../utils/colors";
import Shell from "../../components/Shell";
import Subscribe from "../../components/Susbscribe.js";
import SEO, { ArticleStructuredData } from "../../components/SEO";
import Nav from "../../components/Nav";
import PostCard from "../../components/PostCard";
import str from "../../utils/string";
import img from "../../utils/image";
import plant from "../../images/plant.png";
import fbIcon from "../../images/icons/fb.svg";
import twitterIcon from "../../images/icons/twitter.svg";
import Markdown from "../../components/Markdown";

const Related = ({ relatedPosts }) => {
  return (
    <div>
      <div className="f6 ttu b pt2 mt4">Related Posts</div>
      <div className="mt3">
        {relatedPosts.map((p) => (
          <div key={p.data.slug} className="mt4">
            <PostCard post={p} />
          </div>
        ))}
      </div>
    </div>
  );
};

const shareUrls = {
  twitter: (link = "", message = "") =>
    `https://twitter.com/intent/tweet/?text=${encodeURIComponent(
      message
    )}&url=${encodeURIComponent(link)}`,
  facebook: (link = "") => `https://facebook.com/sharer/sharer.php?u=${link}`,
  linkedin: (link = "", message = "") =>
    `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(
      link
    )}
    &title=${encodeURIComponent(message)}&summary=${encodeURIComponent(
      message
    )}&source=${encodeURIComponent(link)}`,
  mail: (link = "", subject, body) =>
    `mailto:?subject=${encodeURIComponent(
      subject || ""
    )}&body=${encodeURIComponent((body && `${body}\n\n${link}`) || link)}`,
  whatsapp: (link = "", message = "") =>
    `whatsapp://send?text=${encodeURIComponent(message)}%20${encodeURIComponent(
      link
    )}`,
  telegram: (link = "", message = "") =>
    `https://telegram.me/share/url?text=${encodeURIComponent(
      message
    )}&url=${encodeURIComponent(link)}`,
  hn: (link = "", message = "") =>
    `https://news.ycombinator.com/submitlink?u=${encodeURIComponent(
      link
    )}&t=${encodeURIComponent(message)}`,
};

const openAndFocus = (link) => {
  // https://stackoverflow.com/questions/4907843/open-a-url-in-a-new-tab-and-not-a-new-window

  return () => {
    const openedWin = window.open(link, "_blank");
    openedWin.focus();
  };
};

// Need this trickery because Adblock blocks links to twitter and facebook
const ShareButton = ({ link, children }) => (
  <div onClick={openAndFocus(link)} className="pointer">
    {children}
  </div>
);

const Share = ({ title, url }) => {
  return (
    <div className="flex">
      <ShareButton link={shareUrls.twitter(url, `${title} by @shivek_khurana`)}>
        <img className="block" src={twitterIcon} alt="" />
      </ShareButton>
    </div>
  );
};

const AuthorImage = ({ profilePicture, name }) => {
  const optimizedPaths = img.getOptimizedPaths(profilePicture);
  return <img src={optimizedPaths.w80} className="br-100" alt={name} />;
};

const Author = ({ author, publishedOn }) => {
  return (
    <div className="flex mt4 items-center justify-between">
      <div className="flex items-center">
        <div className="w3">
          <AuthorImage
            profilePicture={author.profilePicture}
            name={author.name}
          />
        </div>
        <div className="pl2">
          <div className="b f6">
            <Link className="underline" to={`/authors/${author.slug}`}>
              {author.name}
            </Link>
          </div>
          <div className="f7 mt1 bp3-text-muted mb2">
            {str.humanReadableDate(publishedOn)}
          </div>
        </div>
      </div>
    </div>
  );
};

const parse = (url) => {
  if (url.includes("medium.com")) return "Medium";
  else if (url.includes("newline.co")) return "Newline";
  else return url;
};

const CanonicalRef = ({ canonicalUrl }) => {
  return (
    <div className="mt3 bg-black-10 pa2 br2 black-60">
      This blog was originally published on{" "}
      <a href={canonicalUrl} className="black">
        {str.capitalise(parse(canonicalUrl))}.
      </a>
    </div>
  );
};
const Post = () => {
  const {
    contents,
    title,
    subTitle,
    heroImg,
    tags,
    publishedOn,
    author,
    canonicalUrl,
    relatedPosts,
    slug,
  } = useRouteData();
  const { pathname } = useLocation();

  return (
    <Shell>
      <SEO
        title={title}
        subTitle={subTitle}
        author={author}
        heroImg={heroImg}
        tags={tags}
        publishedOn={publishedOn}
        canonicalUrl={canonicalUrl}
      />

      <ArticleStructuredData
        title={title}
        heroImg={heroImg}
        publishedOn={publishedOn}
        authorName={author.name}
        tags={tags}
        url={`https://krimlabs.com/blog/${slug}`}
        subTitle={subTitle}
      />

      <article className="mt3 pb5" style={{ overflowWrap: "break-word" }}>
        <div className="center w-90 w-80-m w-50-l">
          <h1 className="f3 f2-m f1-l b mt5">{title}</h1>
          {subTitle && (
            <h2 className="f4 f3-ns normal black-80 mt1 mb2 bp3-text-muted">
              {subTitle}
            </h2>
          )}
          <Author author={author} publishedOn={publishedOn} />
        </div>

        {heroImg && (
          <div className="center w-90 w-80-m w-60-l mv4">
            <img src={heroImg} className="br2" />
          </div>
        )}

        <Markdown contents={contents} />

        <div className="center w-90 w-80-m w-50-l">
          <div className="f4">
            {canonicalUrl && <CanonicalRef canonicalUrl={canonicalUrl} />}
          </div>
          <div className="mt5">
            <Subscribe />
          </div>
          {relatedPosts.length > 0 && <Related relatedPosts={relatedPosts} />}
        </div>
      </article>
    </Shell>
  );
};

export default Post;
