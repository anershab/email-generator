/*
By default, Outlook.com centers your email by placing it inside a div with a class named "ExternalClass" using the styles display:inline-block; line-height: 131%.
These have no effect when using IE, however in every other browser, the email will not be centered.

To overwrite these styles simply include this in your embedded CSS (<style></style>) within the <head></head> of the emails HTML.
*/

const outlookExternalClass = `<style type="text/css">
table {border-collapse:separate;}
a, a:link, a:visited {text-decoration: none; color: #00788a;}
a:hover {text-decoration: underline;}
h2,h2 a,h2 a:visited,h3,h3 a,h3 a:visited,h4,h5,h6,.t_cht {color:#000 !important;}
.ExternalClass p, .ExternalClass span, .ExternalClass font, .ExternalClass td {line-height: 100%;}
.ExternalClass {width: 100%;}
</style>`;

export default outlookExternalClass;
