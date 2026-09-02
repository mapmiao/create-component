import { ref, type Ref } from 'vue'

export interface Use{{componentName}}Result {
  count: Ref<number>
  handleClick: () => void
}

export function {{hookName}}(props: Record<string, unknown>): Use{{componentName}}Result {
  const count = ref(0)

  const handleClick = () => {
    count.value += 1
  }

  return {
    count,
    handleClick,
  }
}