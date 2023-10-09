/*
In order to include your email template in the sidebar, add the following to the end of this file:
    export const YourComponentName = {
        metaData { ...defaultProps },
        component: import("/ComponentDir/ComponentFile")
    };
*/

export const Example = {
  props: { name: "Default" },
  component: import("./Example/Example"),
};
