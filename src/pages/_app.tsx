import { ThemeProvider } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import "@vertexvis/viewer/dist/viewer/viewer.css";
import { AppProps } from "next/app";
import Head from "next/head";
import React from "react";
import theme from "../lib/theme";

export default function App({ Component, pageProps }: AppProps): JSX.Element {
  React.useEffect(() => {
    const jssStyles = document.querySelector("#jss-server-side");
    if (jssStyles) jssStyles.parentElement?.removeChild(jssStyles);
  }, []);

  return (
    <>
      <Head>
        <title>Vertex 3D Visual Analytics</title>
        <link rel="icon" href="/favicon-512x512.png" />
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
        <meta
          name="description"
          content="Example showing how easy it is to connect external data sources to your 3D digital twin for visual analytics using the Vertex platform."
        />
      </Head>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Component {...pageProps} />
      </ThemeProvider>
    </>
  );
}
