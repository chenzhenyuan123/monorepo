
<script setup name="ThemeConfig">

const radio = ref("1")
const value = ref('')

const options = [
  {
    value: 'Option1',
    label: 'Option1',
  },
  {
    value: 'Option2',
    label: 'Option2',
  },
  {
    value: 'Option3',
    label: 'Option3',
  },
  {
    value: 'Option4',
    label: 'Option4',
  },
  {
    value: 'Option5',
    label: 'Option5',
  },
]
</script>

<template>
  <div class="theme-config-container">
    <h1>
      Element Plus Theme Config
    </h1>

    <div class="module"> <el-divider content-position="left">
        <h2>Button 按钮</h2>
      </el-divider>
      <el-button type="primary">Primary</el-button>
      <el-button>Default</el-button>
      <el-button type="success">Success</el-button>
      <el-button type="info">Info</el-button>
      <el-button type="warning">Warning</el-button>
      <el-button type="danger">Danger</el-button>
    </div>
    <div class="module"> <el-divider content-position="left">
        <h2>Input 输入框</h2>
      </el-divider>
      <div class="flex mb4 ">
        <el-input style="width: 240px" size="large" placeholder="Please Input" />
        <el-input style="width: 240px" placeholder="Please Input" />
        <el-input style="width: 240px" size="small" placeholder="Please Input" />
      </div>
      <div class="flex mb4 ">
        <el-input style="width: 240px" size="large" placeholder="Please Input" :suffix-icon="Search" />
        <el-input style="width: 240px" placeholder="Please Input" :suffix-icon="Search" />
        <el-input style="width: 240px" size="small" placeholder="Please Input" :suffix-icon="Search" />
      </div>
      <div class="flex mb4">
        <el-input style="width: 240px" size="large" placeholder="Please Input" :prefix-icon="Search" />
        <el-input style="width: 240px" placeholder="Please Input" :prefix-icon="Search" />
        <el-input style="width: 240px" size="small" placeholder="Please Input" :prefix-icon="Search" />
      </div>
    </div>
    <div class="module"> <el-divider content-position="left">
        <h2>Radio 单选框</h2>
      </el-divider>
      <div class="mb-2 ml-4">
        <el-radio-group v-model="radio">
          <el-radio value="1" size="large">Option 1</el-radio>
          <el-radio value="2" size="large">Option 2</el-radio>
        </el-radio-group>
      </div>
      <div class="my-2 ml-4">
        <el-radio-group v-model="radio">
          <el-radio value="1">Option 1</el-radio>
          <el-radio value="2">Option 2</el-radio>
        </el-radio-group>
      </div>
      <div class="my-4 ml-4">
        <el-radio-group v-model="radio">
          <el-radio value="1" size="small">Option 1</el-radio>
          <el-radio value="2" size="small">Option 2</el-radio>
        </el-radio-group>
      </div>
      <el-radio v-model="radio" disabled value="disabled">Option A</el-radio>
      <el-radio v-model="radio" disabled value="selected and disabled">
        Option B
      </el-radio>
    </div>
    <div class="module"> <el-divider content-position="left">
        <h2>Select 选择器</h2>
      </el-divider>
      <div class="flex flex-wrap gap-4 items-center">
        <el-select v-model="value" placeholder="Select" size="large" style="width: 240px">
          <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
        <el-select v-model="value" placeholder="Select" style="width: 240px">
          <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>s
        <el-select v-model="value" placeholder="Select" size="small" style="width: 240px">
          <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </div>
    </div>
    <div class="module">
      <el-divider content-position="left">
        <h2>Tag 标签</h2>
      </el-divider>
      <div class="flex gap-2">
        <el-tag type="primary">Tag 1</el-tag>
        <el-tag type="success">Tag 2</el-tag>
        <el-tag type="info">Tag 3</el-tag>
        <el-tag type="warning">Tag 4</el-tag>
        <el-tag type="danger">Tag 5</el-tag>
      </div>
      <div class="flex gap-2">
        <el-tag size="large">Large</el-tag>
        <el-tag>Default</el-tag>
        <el-tag size="small">Small</el-tag>
      </div>

    </div>
    <div class="module">
      <el-divider content-position="left">
        <h2>Tabs 标签页</h2>
      </el-divider>

      <el-tabs v-model="activeName" type="card" class="demo-tabs" @tab-click="handleClick">
        <el-tab-pane label="User" name="first">User</el-tab-pane>
        <el-tab-pane label="Config" name="second">Config</el-tab-pane>
        <el-tab-pane label="Role" name="third">Role</el-tab-pane>
        <el-tab-pane label="Task" name="fourth">Task</el-tab-pane>
      </el-tabs>
    </div>

    <div class="module">
      <el-divider content-position="left">
        <h2></h2>
      </el-divider>
    </div>

    <div class="module">
      <el-divider content-position="left">
        <h2></h2>
      </el-divider>
    </div>

    <div class="module">
      <el-divider content-position="left">
        <h2></h2>
      </el-divider>
    </div>

    <div class="module">
      <el-divider content-position="left">
        <h2></h2>
      </el-divider>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.module {
  padding: 10px 0;
}

.mb4 {
  margin-bottom: 1rem;
}

.ml-4 {
  margin-left: 4px;
}

.flex {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>