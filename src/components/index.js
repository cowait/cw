import CwTable from './table/CwTable'
import CwSelect from './select/CwSelect'

const components = {
  CwTable,
  CwSelect,
}

const install = function(Vue) {
  if (install.installed) return;
  Object.keys(CwTable).forEach(name => {
    Vue.component(name, components[name])
  })
};

export default {
  install,
  ...components
}
