import React from "react";
import { Button } from "@react-email/button";
import { Column } from "@react-email/Column";
import { Link } from "@react-email/Link";
import { Heading } from "@react-email/Heading";
import { Text } from "@react-email/Text";
import { Font } from "@react-email/Font";
import { Container } from "@react-email/container";
import { Row } from "@react-email/Row";
import { Hr } from "@react-email/Hr";
import "./Example.css";

export default function ExampleComponent(props) {
  return (
    <Container>
      <Row>
        <Column>
          <Font fontFamily="Roboto" fallbackFontFamily="Verdana" />
          <Heading className="header">{`Hello, ${props.name}!`}</Heading>
          <Hr />
          <Text>This is a JSX to email HTML conversion example.</Text>
          <Row>
            <Text>
              Here is a <Link href="https://www.google.com">a link</Link> for
              you to enjoy.
            </Text>
          </Row>
        </Column>
      </Row>
      <Row className="centered">
        <Column>
          <Button
            className="btn"
            pX={20}
            pY={12}
            href="https://example.com"
            style={{ color: "#fff", borderRadius: 8 }}
          >
            Action item!
          </Button>
        </Column>
      </Row>
    </Container>
  );
}
