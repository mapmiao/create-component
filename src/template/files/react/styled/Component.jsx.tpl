import * as React from "react";
import styles from "./index.module.{{style}}";

const {{componentName}}: React.FC = () => {
  return <div className={styles.{{camelName}}}>{{componentName}}</div>;
};
export default {{componentName}};