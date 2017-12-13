import serialize from 'serialize-javascript'

export default ({ styles, state, html, main }) => `<!doctype html>
<html lang="en">
  <head>

    <title>[::]</title>

    <meta charset="utf-8" />
    ${__PROD__ ? '<base href="https://fcc.sigsev.io">' : ''}
    <meta name="theme-color" content="#000000" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />

    <link rel="icon" href="/assets/favicon.ico" type="image/x-icon" />
    <link href="https://s3-us-west-2.amazonaws.com/s.cdpn.io/258531/react-vis.css" rel="stylesheet">

    <style>
      *, *:after, *:before {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
        font: inherit;
        color: inherit;
        border: none;
        background: transparent;
      }
    </style>
    ${styles}
    <script>
      window.__INITIAL_STATE__ = ${serialize(state)}
    </script>
  </head>
  <body>
    <div id="root">${html}</div>
    <script src="/dist/${main}"></script>
  </body>
</html>`
