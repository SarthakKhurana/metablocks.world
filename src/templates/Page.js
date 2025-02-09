import React, { useState } from "react";
import { useRouteData } from "react-static";
import convert from "htmr";

import { TokenomicsNav } from "../components/Nav";
import Shell from "../components/Shell";
import SEO from "../components/SEO";
import Markdown from "../components/Markdown";
import colors from "../utils/colors";

const Page = () => {
  const { contents, title, heroImg } = useRouteData();

  return (
    <React.Fragment>
      <SEO title={`Meta Blocks / ${title}`} />
      <Shell>
        <div className="pt5">
          <Markdown contents={contents} />
        </div>
      </Shell>
    </React.Fragment>
  );
};

export default Page;
