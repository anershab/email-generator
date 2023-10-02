### 💡 Testing your Emails

You can validate your HTML outputs [in this website](https://www.htmlemailcheck.com/check/).

# 📨 Email Generator

This service contains two projects, loosely coupled.

## 🔨 Frontend

The "Frontend" project is strictly for ease of local development purposes. It does not run as a service anywhere but your own personal machine.

It is a simple React application that loads components from the `emails` folder dynamically.

To start it, run `npm run front`. Then, you may load your desired component through the URL bar.

For example: To load the component `/emails/Welcome/Welcome.jsx`, type in `localhost:3000/Welcome`. Casing is important!

Edit your component as you see fit; changes will be reflected in the browser.

Your components may accept a prop object like any other React component. However, bear in mind that these are emails and clients will reject and prune JS code. If you want to use flashy components, seek CSS alternatives.

**⚠️ Important! Component files must be located under their own folder.**

#### 🎨 Styling

Many email clients do not support tags like `<div>`: you should heavily favor use of React-Email components included in the project. They serve as semantic wrappers for tags tested on most email clients which have fallen out favor in modern frontend applications (such as `<td>`). You can [read more about their usage here](https://react.email/docs/components/).

> 👉 _You do not need to include `<Html>` or `<Head>` in your component. The backend takes care of this._

The project only support vanilla CSS. An additional requirement is that the CSS file is named exactly like the component file itself. For example, `Welcome.jsx` and `Welcome.css`. Importing any other CSS files into the component will result in the styling being lost in the transformation.

## 🤖 Server

The server is a Fastify application with the following endpoints:

### `POST /transform { props, template } `

This endpoint will take a component, transform it to a plain HTML file, and send it back to the client.

The `template` field refers to the component name, without the file extension, as found under `src/emails`.
The `props` field is the props object as required by the component, and will be injected as is into it.

For example, given a component `/emails/Welcome/Welcome.jsx` that looks like this:

```
import React from 'react';
export default function WelcomeComponent(props) {
  return <h1>{`Hello, ${props.name}!`}</h1>
}
```

passing a body of:

```
{
  template: 'Welcome',
  props: {
    name: 'Aner'
  }
}
```

Will transform `emails/Welcome/Welcome.jsx` to a HTML file with `Aner` properly injected into the `props.name` field.

### `POST /batch [ { props, template }, { props, template } ... ] `

This endpoint is similar to `/transform`, but will process an array of templates.

Expected body payload example:

```
[
  {
    template: 'Welcome',
    props: {
      name: 'Aner'
    }
  },
  {
    template: 'Introduction',
    props: {
      company: 'Gong',
      name: 'Aner'
    }
  }
]
```

The response will be an array of HTML strings.

Note that if you are trying to debug through this endpoint, arrays will render without styles on the browser, as vendors concatenate `<head>` tags when detecting multiples and the `<style>` tag will become part of the iterated object.
