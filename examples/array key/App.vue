<template>
  <div>
    <div>
      <label for="limit">Pokémon Limit</label>
      <input type="text" v-model="limit" name="limit" />
    </div>
    <div>
      <label for="offset">Pokémon Offset</label>
      <input type="text" v-model="offset" name="offset" />
    </div>
    <Repos :key="`${limit}-${offset}`" :limit="limit" :offset="offset"/>
  </div>
</template>

<script>
import Repos from './Repos'

export default {
  components: { Repos },
  data () {
    return {
      limit: 10,
      offset: 0
    }
  }
}
</script>

<style scoped>
body {
  font-size: 1rem;
}
</style>
