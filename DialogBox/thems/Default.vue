<template>
  <div :class="['dialogbox-wrap']">
    <div slot="title" class="dialog-title">
      <slot name="title"></slot>
    </div>
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'ThenDefault'
}
</script>

<style lang="less" scoped>
.dialogbox-wrap{
  background: #fff;
  border-radius: 6px;
  .dialog-title {
    border-bottom: 1px solid #f2f2f2;
    padding: 22px;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-pack: justify;
    -ms-flex-pack: justify;
    justify-content: space-between;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
  }
}
</style>
