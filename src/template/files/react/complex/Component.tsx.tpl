import * as React from "react";
import styles from "./index.module.{{style}}";
import { {{hookName}} } from "./hook/{{hookName}}";

interface I{{componentName}}Props {}

const {{componentName}}: React.FC<I{{componentName}}Props> = () => {
  const { count, handleClick } = {{hookName}}();

  return (
    <div className={styles.{{camelName}}} onClick={handleClick}>
      <span>{{componentName}} ({count})</span>
    </div>
  );
};
export default {{componentName}};