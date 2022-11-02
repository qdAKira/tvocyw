<template>
  <div>
    <a-table :row-selection="rowSelection" :columns="columns" :data-source="data">
    <a slot="name" slot-scope="text">{{ text }}</a>
    </a-table>
  </div>
</template>

<script>
const columns = [
  {
    title: 'Name',
    dataIndex: 'name',
    scopedSlots: { customRender: 'name' },
  },
  {
    title: 'Age',
    dataIndex: 'age',
  },
  {
    title: 'Address',
    dataIndex: 'address',
  },
];
const data = [
  {
    key: '1',
    name: 'John Brown',
    age: 32,
    address: 'New York No. 1 Lake Park',
  },
  {
    key: '2',
    name: 'Jim Green',
    age: 42,
    address: 'London No. 1 Lake Park',
  },
  {
    key: '3',
    name: 'Joe Black',
    age: 32,
    address: 'Sidney No. 1 Lake Park',
  },
  {
    key: '4',
    name: 'Disabled User',
    age: 99,
    address: 'Sidney No. 1 Lake Park',
  },
];
import {getCompanyList} from '@/request/api'
export default {
  name: 'Dashboard',
  data() {
    return {
      data,
      columns,
      
    };
  },
  
}
</script>

<style scoped>

</style>
