import * as React from "react";
import styles from "./index.module.{{style}}";
import { {{hookName}} } from "./hook/{{hookName}}";

const {{componentName}}: React.FC = () => {
  const { count, handleClick } = {{hookName}}();

  return (
    <div className={styles.{{camelName}}} onClick={handleClick}>
      <span>{{componentName}} ({count})</span>
    </div>
  );
};
export default {{componentName}};