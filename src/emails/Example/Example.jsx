import React from "react";
import "./Example.css";
export default function ExampleComponent(props) {
  return (
    <div>
      <h1 className="header">{`Hello, ${props.name}!`}</h1>
      <p>This is a JSX to email HTML conversion example.</p>
      <a href="https://www.google.com">Link</a>
    </div>
  );
}
