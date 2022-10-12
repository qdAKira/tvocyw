<template>
  <div class="pagination">
    
    <button :disabled="pageNo==1"@click="$emit('getPageNo1',pageNo-1)"id="changePage">上一页</button>
    <button v-if="startNumberAndEndNumber.start>1" @click="$emit('getPageNo1',1)":class="{active:pageNo==1}"id="page">1</button>
    <button v-if="startNumberAndEndNumber.start>2"id="diandian">·····</button>

    <button v-for="(page,index) in startNumberAndEndNumber.end":key="index" v-if="page>=startNumberAndEndNumber.start"@click="$emit('getPageNo1',page)":class="{active:pageNo==page}"id="page">{{page}}</button>
    
    
    <button v-if="startNumberAndEndNumber.end<totalMount-1 "id="diandian">·····</button>
    <button v-if="startNumberAndEndNumber.end < totalMount" @click="$emit('getPageNo1',totalMount)":class="{active:pageNo==totalMount}"id="page">{{totalMount}}</button>
    <button :disabled="pageNo==totalMount"@click="$emit('getPageNo1',pageNo+1)"class="changePage"id="changePage">下一页</button>
    
    <!-- <button style="margin-left: 30px">{{total}}</button> -->
    <!-- <h1>{{startNumberAndEndNumber}}----{{pageNo}}</h1> -->
  </div>

</template>

<script>
export default {
  name:'Pagination1',
  props:['pageNo','pageSize','total','continues'],

  computed:{
    //一共多少页
    totalMount(){
      // 向上取整
      return Math.ceil(this.total/this.pageSize) -1
    },
    // 计算出连续的页码起始数字与结束数字
    startNumberAndEndNumber(){
      const {continues,pageNo,totalMount} = this;
      // 先定义两个变量存储起始数字与结束数字
      let start =0, end = 0;
      // 连续页面数为5，不正常现象：数据不够五页
      if(continues>totalMount){
        start = 1;
        end = totalMount;
      }else{
        //正常现象，总页数大于5
        start = pageNo - parseInt(continues/2);
        end = pageNo + parseInt(continues/2);
        // start出现负数情况
        if(start <1){
          start = 1;
          end = continues;
        }
        // end超总页码的时候
        if(end>totalMount){
          start = totalMount - continues+1;
          end = totalMount
        }
      }
      return {start,end}
    }
  }
}
</script>

<style scoped lang='less'>
.pagination {
  text-align: center;
    button {
      margin: 0 3px;
      // background-color: #f4f4f5;
      color: #606266;
      outline: none;
      // border-radius: 2px;
      // border-radius: 50%;
      padding: 0 1px;
      vertical-align: top;
      display: inline-block;
      // font-size: 10px;
      // min-width: 25px;
      // height: 25px;
      // line-height: 25px;
      cursor: pointer;
      box-sizing: border-box;
      text-align: center;
      // border: 1px solid #13ecce;
      // 设置成圆形
      // border-radius: 50%;
      background-color: transparent;
      color:#13ecce;
      text-decoration: none;

      &[disabled] {
        // color: #c0c4cc;
        color: #c0c4cc;
        cursor: not-allowed;
      }

      &.active {
        cursor: not-allowed;
        // background-color: #409eff;
        background-color: #13ecce;
        color: #fff;
      }
    };
    #page {
      font-size: 10px;
      min-width: 22px;
      height: 22px;
      line-height: 22px;
      border-radius: 50%;
      border: 1px solid #13ecce
    };
    #changePage {
      height: 24px;
      width: 56px;
      border-radius: 10px;
      text-align: center;
      font-size: 10px;
      border: 1px solid #13ecce
    }
    #diandian{
      border-color: transparent;
      font-size: 10px;
      min-width: 22px;
      height: 22px;
      line-height: 22px;
      border-radius: 50%;
    }
  }

</style>