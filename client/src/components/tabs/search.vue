<template>
  <div>
    <div class="v-layout v-gutter v-alignment-top-center">
    <div class="v-layout-item v-size-95">
<search-form></search-form>  
</div>
  <div class="v-layout-item v-size-95">
<search-list></search-list> 
</div>
</div>
</div>  
  </template>
  
  <script>
import searchForm from "@/components/search/search-form";
import searchList from "@/components/search/search-list";
export default {
  components: {
    "search-form": searchForm,
    "search-list": searchList
  }
};
</script>  
<style scoped>

</style>

