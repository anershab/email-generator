import React, {
  Suspense,
  lazy,
  useRef,
  useEffect,
  useState,
  useCallback,
} from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./index.css";
import * as EmailTemplates from "./emails";

const modalStyle = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9,
  },
  modal: {
    fontFamily: "sans-serif",
    background: "#fff",
    padding: "20px",
    borderRadius: "5px",
    boxShadow: "0px 0px 10px 0px rgba(0, 0, 0, 0.5)",
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    gap: 8,
  },
  close: {
    padding: "10px 20px",
    marginTop: "10px",
    cursor: "pointer",
  },
};
const wrapperStyle = {
  display: "flex",
  flexDirection: "row",
};

const Home = () => (
  <p style={{ fontFamily: "sans-serif" }}>
    Hello! Refer to README.md for usage.
  </p>
);

const SideMenu = ({ templates, openModal }) => {
  const pathName = window.location.pathname.replace("/", "");
  return (
    <div className="emailgen__side-menu">
      {templates.map((template) => (
        <div key={template.name} className="emailgen__item">
          <a href={`/${template.name}`}>{template.name}</a>
          {pathName === template.name && (
            <button
              onClick={() =>
                openModal({ name: template.name, props: template.defaultProps })
              }
            >
              ⚙
            </button>
          )}
        </div>
      ))}
    </div>
  );
};

const Modal = ({ modalVisible, modalProps, onClose, children }) => {
  const [propState, setPropState] = useState(modalProps);
  if (!modalVisible) {
    return null;
  }
  const onValueChanged = (e, propKey) => {
    setPropState({
      ...propState,
      [propKey]: e.target.value,
    });
  };

  return ReactDOM.createPortal(
    <div style={modalStyle.overlay}>
      <div style={modalStyle.modal}>
        <h4>{`Props for ${modalProps.name}`}</h4>
        {Object.entries(modalProps.props).map((prop) => {
          const [propKey, propValue] = prop;
          return (
            <div
              key={propKey}
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                gap: 8,
              }}
            >
              <span>{propKey}</span>
              <input
                type="text"
                defaultValue={propState[propKey]}
                onChange={(e) => onValueChanged(e, propKey)}
              />
            </div>
          );
        })}
        <button
          style={modalStyle.close}
          onClick={() => onClose(modalProps.name, propState)}
        >
          Save
        </button>
      </div>
    </div>,
    document.body
  );
};

const App = () => {
  const [templates, setTemplates] = useState([]);

  const [savedProps, setSavedProps] = useState({});
  const [modalVisible, setModalVisible] = useState(false);
  const modalProps = useRef({});

  const openModal = ({ name, props }) => {
    modalProps.current = { name, props, savedProps };
    setModalVisible(true);
  };

  const currentTemplate = window.location.pathname.replace("/", "");

  const getCurrentTemplateDefaultProps = useCallback(() => {
    const target = templates.find(
      (template) => template.name === currentTemplate
    );
    if (target) {
      return target.defaultProps;
    }
    return {};
  }, [currentTemplate, templates]);

  useEffect(() => {
    const components = Object.entries(EmailTemplates);
    const componentMap = components.map((entry) => {
      return {
        name: entry[0],
        component: entry[1].component,
        defaultProps: entry[1].props,
      };
    });

    setTemplates(componentMap);
  }, []);

  console.log({
    ...getCurrentTemplateDefaultProps(),
    ...savedProps,
  });
  return (
    <div style={wrapperStyle}>
      <SideMenu templates={templates} openModal={openModal} />
      <Router>
        <Suspense fallback={<Home />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route
              path="*"
              element={
                <DynamicComponentLoader
                  savedProps={{
                    ...getCurrentTemplateDefaultProps(),
                    ...savedProps[currentTemplate],
                  }}
                />
              }
            />
          </Routes>
        </Suspense>
      </Router>
      <Modal
        modalVisible={modalVisible}
        modalProps={modalProps.current}
        onClose={(template, newProps) => {
          setSavedProps({
            ...savedProps,
            [template]: newProps,
          });
          setModalVisible(false);
        }}
      />
    </div>
  );
};

const DynamicComponentLoader = ({ savedProps }) => {
  const segments = window.location.pathname
    .split("/")
    .filter((segment) => segment !== "");
  const componentName = segments[0] || "Home";
  const DynamicComponent = lazy(() =>
    import(`./emails/${componentName}/${componentName}`)
  );
  return (
    <div style={{ width: "100%", backgroundColor: "#F1F1F1", marginLeft: 240 }}>
      <Suspense fallback={<Home />}>
        <DynamicComponent {...savedProps} />
      </Suspense>
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
