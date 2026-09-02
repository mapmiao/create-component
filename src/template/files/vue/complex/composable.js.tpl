import { ref } from 'vue'

export function {{hookName}}(props) {
  const count = ref(0)

  const handleClick = () => {
    count.value += 1
  }

  return {
    count,
    handleClick,
  }
}