<template>
  <div>
    <div v-if="error">{{ error.message }}</div>
    <div v-if="data">
      <pre> {{ data }}: {{ data.length }}</pre>
    </div>
    <div v-if="!data && !error">Loading...</div>
  </div>
</template>

<script>
import useSWRV from 'swrv'

const fetcher = key => fetch(key).then(resp => {
  return resp && resp.json()
}).then(data => {
  if (data.message) {
    throw new Error(data.message)
  }
  return data
})

export default {
  props: {
    limit: {
      type: Number,
      required: true
    },
    offset: {
      type: Number,
      required: true
    }
  },
  setup ({ limit, offset }) {
    const endpoint = `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`
    const { data, error } = useSWRV(endpoint, fetcher, {
      revalidateOnFocus: false
    })

    return {
      data,
      error
    }
  }
}
</script>
