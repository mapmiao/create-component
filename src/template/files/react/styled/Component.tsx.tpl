import * as React from "react";
import styles from "./index.module.{{style}}";

interface I{{componentName}}Props {}

const {{componentName}}: React.FC<I{{componentName}}Props> = () => {
  return <div className={styles.{{camelName}}}>{{componentName}}</div>;
};
export default {{componentName}};