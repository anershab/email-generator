import React from "react";
import { Column } from "@react-email/Column";
import { Link } from "@react-email/Link";
import { Heading } from "@react-email/Heading";
import { Text } from "@react-email/Text";
import { Font } from "@react-email/Font";
import { Container } from "@react-email/container";
import { Row } from "@react-email/Row";
import { Img } from "@react-email/Img";
import { Hr } from "@react-email/Hr";
import { Section } from "@react-email/section";
import "./FirstCallAsOwner.css";

const rowStyle = {
  width: "100%",
  background: "white",
  padding: "0 10%",
};

const getBooleanStringValue = (str) => (String(str) === "false" ? false : true);

const InstructionStepOne = ({ botName, isCloudRecording }) => {
  return (
    <Step
      ctaText="When joining the call:"
      index="1"
      body={
        isCloudRecording ? (
          <Text>
            You'll notice that the meeting begins by recording automatically. If
            you know you don’t want the call to be recorded ahead of time, you
            can set the calendar event to private and the recording will be
            skipped.
          </Text>
        ) : (
          <Text>
            You’ll notice that a{" "}
            <Link href="https://help.gong.io/hc/en-us/articles/360055500812-Record-a-web-conference-call">
              Gong bot
            </Link>{" "}
            named {botName} has joined the meeting as a participant. If your
            meeting has a waiting room, be sure to admit the bot onto the call
            if you want it to be recorded.
          </Text>
        )
      }
    />
  );
};
const InstructionStepTwo = ({ botName, isCloudRecording }) => {
  return (
    <Step
      ctaText="During your conversation:"
      index="2"
      body={
        isCloudRecording ? (
          <Text>
            Don't be shy to ask for consent. According to our data, customers
            consent to record over 96% of sales calls. If needed, you may stop
            or pause the recording at any time.
          </Text>
        ) : (
          <Text>
            Don't be shy to ask for consent. Customers consent to record over
            96% of sales calls. If needed, you may stop the recording by{" "}
            <Link href="https://help.gong.io/hc/en-us/articles/360042204551-Stop-a-recording">
              removing the "{botName}"
            </Link>{" "}
            from the conference call or canceling the recording from the Gong
            app home page.
          </Text>
        )
      }
    />
  );
};

export default function FirstCallAsOwner({
  firstName,
  callTitle,
  botName,
  companyName,
  isCloudRecorded,
}) {
  const isCloudRecording = getBooleanStringValue(isCloudRecorded);
  return (
    <Container style={{ marginTop: "32px", marginBottom: "32px" }}>
      <Font fontFamily="Arial" fallbackFontFamily="sans-serif" />
      <Row className="email-header">
        <Img
          src={"/assets/LogoGong.png"}
          alt="Gong Logo"
          width="80"
          style={{
            margin: "0 auto",
            height: "100%",
            width: "auto",
          }}
        />
      </Row>
      <Section
        style={{
          marginTop: 16,
          backgroundColor: "white",
          paddingBottom: 16,
          ...rowStyle,
        }}
      >
        <Row>
          <Img src={"/assets/NumberOne.png"} style={{ margin: "0 auto" }} />
          <Heading as="h2" style={{ textAlign: "center" }}>
            You’re about to host your first recorded call using Gong!
          </Heading>
        </Row>
        <Row>
          <Text>
            Hi {firstName},
            <br />
            Your upcoming call "{callTitle}" is set to be recorded by Gong so
            that you can focus on the conversation instead of taking notes.
          </Text>
          <Hr style={{ marginTop: 24 }} />
        </Row>
        <Row
          style={{
            ...rowStyle,
          }}
        >
          <Row className="image-header">
            <Img src={"/assets/LightBulbOn.png"} />
            <Text>Here's what you should know:</Text>
          </Row>
          <InstructionStepOne
            botName={botName}
            isCloudRecording={isCloudRecording}
          />
          <InstructionStepTwo
            botName={botName}
            isCloudRecording={isCloudRecording}
          />
          <Step
            ctaText="Soon after it's over"
            index="3"
            body={
              <Text>
                A link to the recording will be sent to internal participants by
                email. Listen back, share with your customers, and collaborate
                with others by commenting, sharing snippets, or requesting
                feedback.
              </Text>
            }
          />
        </Row>
        <Row>
          <Text style={{ textAlign: "center" }}>
            Learn more about{" "}
            <Link href="https://gong.app.gong.io/troubleshooting/user-email?email_template=WELCOME_FIRST_CALL_AS_OWNER">
              recording calls with Gong
            </Link>
          </Text>
        </Row>
      </Section>
      <Row>
        <Text
          style={{
            textAlign: "center",
            fontSize: 12,
            marginTop: 48,
            lineHeight: "18px",
            color: "#636467",
          }}
        >
          You are receiving this email because your company, {companyName}, has
          subscribed to Gong for capturing and analyzing sales calls.
        </Text>
      </Row>
    </Container>
  );
}

const Step = ({ index, ctaText, body }) => {
  const assetPath = "/assets/item_";
  return (
    <Row className="step-row">
      <Column style={{ position: "relative", width: 34 }}>
        <Img
          style={{ position: "absolute", top: 0 }}
          height="26"
          width="26"
          src={assetPath + index + ".png"}
        />
      </Column>
      <Column>
        <Text style={{ fontWeight: 600, marginTop: 2 }}>{ctaText}</Text>
        {body}
      </Column>
    </Row>
  );
};
