import LoadingIndicator_3Squares from "images/LoadingIndicator_3Squares.gif";
import React from "react";

export const PanelLoadingScreen: React.FunctionComponent = () => (
  <div className="dataExplorerLoaderContainer dataExplorerPaneLoaderContainer">
    <img className="dataExplorerLoader" src={LoadingIndicator_3Squares} />
  </div>
);
