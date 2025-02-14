import Bowser from "bowser";
import InAppSpy, { SFSVCExperimental } from "inapp-spy";
import { toSentenceCase } from "../utils";
import styled, { keyframes } from "styled-components";
import { Modal } from "../base/Modal";
import {
  InfoCircledIcon,
  CopyIcon,
  GitHubLogoIcon,
  CheckIcon,
} from "@radix-ui/react-icons";
import { useState, useEffect } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";

const fadeUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const FadeInIcon = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;
  animation: ${fadeUp} 0.3s ease;
`;

const Section = styled.section`
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
  padding: 0px 15px;
`;
const Box = styled.div`
  width: 100%;
  padding: 25px 20px 20px;
  border-radius: var(--border-radius);
  display: flex;
  h2 {
    font-size: 1.35rem;
    font-weight: normal;
    line-height: 1.15;
    text-wrap: balance;
    flex: 1;
    margin-bottom: 0.25rem;
  }
  p {
    font-size: 0.8rem;
    margin-bottom: 0.25rem;
  }
  p:last-of-type {
    margin-bottom: 0px;
  }
`;

const StatBox = styled(Box)`
  background: var(--white);
  color: var(--navy);
`;

const InAppBox = styled(Box)`
  flex-direction: row;
  padding: 20px;
  h2 {
    font-weight: bold;
    margin-bottom: 0;
  }
  p {
    margin-bottom: 0;
  }
`;

export const ModalContentStyling = styled.div`
  padding: 10px;
  line-height: 1.4;
  code {
    background: var(--light-blue);
    padding: 20px 25px;
    border-radius: 10px;
    display: block;
    margin: 15px -5px 0px;
    color: var(--navy);
  }
`;

const Circle = styled.div`
  width: 34px;
  height: 34px;
  background: #000;
  border-radius: 50%;
  justify-content: center;
  display: flex;
  align-items: center;
  flex-shrink: 0;
`;

const getDetectionFeedback = ({
  isInApp,
  isSFSVC,
  appName,
}: {
  isInApp: boolean;
  isSFSVC: boolean;
  appName: string | undefined;
}) => {
  if (isInApp) {
    return {
      inAppTitle: "In-app detected",
      color: "#fff",
      bg: "#B92158",
      buttonBg: "#fff",
      buttonColor: "#b92158",
      inAppSubtitle: appName ? `${appName} App` : "That's a bummer.",
    };
  } else if (isSFSVC) {
    return {
      inAppTitle: "SFSafariViewController detected",
      color: "#d14923",
      bg: "#ffecdd",
      buttonBg: "#d14923",
      buttonColor: "#ffecdd",
      inAppSubtitle: (
        <>
          Detection is highly experimental for Safari 17+ using{" "}
          <code>SFSVCExperimental()</code> from <code>inapp-spy</code>.<br />
          <br />
          SFSVC is an in-app browser that has a cumbersome downloading
          experience compared to a native browser. Here's hoping it becomes more
          streamlined so we don't have to detect it!
          <br />
          <br />
          If there is an error in detection please see info button to report any
          issues.
        </>
      ),
    };
  }
  return {
    inAppTitle: "In-app not detected",
    color: "#007d75",
    bg: "#E9FFF6",
    buttonBg: "#449C82",
    buttonColor: "#fff",
    inAppSubtitle: "No news is good news",
  };
};

export const DeviceInfo = () => {
  const browser = Bowser.getParser(window.navigator.userAgent);
  const platform = browser.getPlatform() || "";
  const vendor = toSentenceCase(platform.vendor || "");
  const device = toSentenceCase(platform.type || "");
  const browserName = toSentenceCase(browser.getBrowserName());
  const engine = toSentenceCase(browser.getEngineName() || "");
  const osVersion = browser.getOSVersion() || "";
  const osName = toSentenceCase(browser.getOSName() || "");
  const osVersionName = toSentenceCase(browser.getOS()?.versionName || "");
  const browserVersion = browser.getBrowserVersion() || "";
  const ua =
    //@ts-ignore
    window.navigator.userAgent || window.navigator.vendor || window.opera;
  const { isInApp, appName } = InAppSpy();

  const [isSFSVC, setSFSVC] = useState(false);

  useEffect(() => {
    SFSVCExperimental({ debug: true }).then(setSFSVC);
  }, []);

  let osText = "Unknown device";
  if (osVersionName || osVersion || vendor || osName || device) {
    osText = `${vendor} ${osName} ${device} ${
      osVersionName || "Version"
    } ${osVersion}`;
  }

  let browserText: React.ReactNode = "Unknown Browser";
  if (browserName || browserVersion || engine) {
    browserText = (
      <>
        {browserName} {browserVersion}{" "}
        {engine && (
          <>
            <br />
            {engine}
          </>
        )}
      </>
    );
  }

  const copyData = [
    {
      name: "Device",
      value: device || "N/A",
    },
    { name: "Vendor", value: vendor || "N/A" },
    { name: "OS", value: osName || "N/A" },
    { name: "Version Name", value: osVersionName || "N/A" },
    { name: "Version", value: osVersion || "N/A" },
    { name: "Browser", value: browserName || "N/A" },
    { name: "Browser Version", value: browserVersion || "N/A" },
    { name: "Engine", value: engine || "N/A" },
  ];

  const copyText =
    `User Agent:\n${ua}\n\n` +
    copyData.map((d) => `${d.name}: ${d.value}`).join("\n");

  const [deviceCopy, setDeviceCopied] = useState({
    copied: 0,
    showCheck: false,
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setDeviceCopied((v) => ({ ...v, showCheck: false }));
    }, 2000);
    return () => clearTimeout(timer);
  }, [deviceCopy.copied]);

  // Inapp section
  const { inAppTitle, color, bg, buttonBg, buttonColor, inAppSubtitle } =
    getDetectionFeedback({ isInApp, isSFSVC, appName });

  return (
    <>
      <Section style={{ marginBottom: 0 }}>
        <Box className="flex-row flex justify-between items-center">
          <h2 style={{ margin: 0 }}>Inapp Debugger</h2>
          <Circle
            as={"a"}
            target="_blank"
            href="https://github.com/shalanah/inapp-debugger"
            style={{
              color: "var(--light-blue)",
              background: "var(--navy)",
            }}
          >
            <GitHubLogoIcon width={20} height={20} />
          </Circle>
        </Box>
      </Section>
      <Section>
        <StatBox className="flex-col">
          <p style={{ marginBottom: ".65rem" }}>{osText}</p>
          <div className="flex flex-row justify-between gap-[5px]">
            <div>
              <h2 style={{ marginBottom: "2rem" }}>{browserText}</h2>
              <p style={{ wordBreak: "break-word" }}>{ua}</p>
            </div>
            <CopyToClipboard
              text={copyText}
              onCopy={
                deviceCopy.showCheck
                  ? () => {} // disabled state
                  : () =>
                      setDeviceCopied((v) => ({
                        ...v,
                        copied: v.copied + 1,
                        showCheck: true,
                      }))
              }
            >
              <div className="flex items-end justify-end">
                <Circle
                  as={"button"}
                  style={{
                    pointerEvents: deviceCopy.showCheck ? "none" : "auto",
                    color: "var(--light-blue)",
                    background: "var(--navy)",
                  }}
                >
                  {deviceCopy.showCheck ? (
                    <FadeInIcon
                      key={`${deviceCopy.showCheck}-${deviceCopy.copied}`}
                    >
                      <CheckIcon width={20} height={20} />
                    </FadeInIcon>
                  ) : (
                    <FadeInIcon
                      key={`${deviceCopy.showCheck}-${deviceCopy.copied}`}
                      style={
                        deviceCopy.copied === 0 ? { animation: "none" } : {}
                      }
                    >
                      <CopyIcon width={17} height={17} />
                    </FadeInIcon>
                  )}
                </Circle>
              </div>
            </CopyToClipboard>
          </div>
        </StatBox>
      </Section>
      <Section>
        <InAppBox
          style={{
            background: bg,
            color,
          }}
        >
          <div className="flex flex-col gap-[5px] flex-auto">
            <h2 style={{ color }}>{inAppTitle}</h2>
            <p>{inAppSubtitle}</p>
          </div>
          <Modal
            title="In-app Detection"
            desc="How we detect in-app browsers"
            button={
              <div className="flex justify-end">
                <Circle
                  as={"button"}
                  style={{
                    color: buttonColor,
                    background: buttonBg,
                  }}
                >
                  <InfoCircledIcon className="m-auto" width={20} height={20} />
                </Circle>
              </div>
            }
          >
            <ModalContentStyling>
              Using the{" "}
              <a
                href="https://www.npmjs.com/package/inapp-spy"
                target="_blank"
                style={{
                  color: "#000",
                  fontWeight: "bold",
                  textDecoration: "underline",
                  textUnderlineOffset: ".2em",
                }}
              >
                `inapp-spy` at version {__DEPENDENCY_VERSION__}
              </a>{" "}
              to detect in-app browsers and experimentally detect
              SFSafariViewController.
              <br />
              <br />
              If you find this result is incorrect, create an issue on{" "}
              <a
                style={{
                  color: "#000",
                  fontWeight: "bold",
                  textDecoration: "underline",
                  textUnderlineOffset: ".2em",
                }}
                href="https://github.com/shalanah/inapp-spy/issues"
                target="_blank"
              >
                GitHub
              </a>
              .
            </ModalContentStyling>
          </Modal>
        </InAppBox>
      </Section>
    </>
  );
};
