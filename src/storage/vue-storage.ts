import { App, InjectionKey, inject, reactive } from "vue";

interface MethodOptions {
  //可索引类型
  [key: string]: Function; //:左边是索引签名，他表示了（引用该接口的）对象的索引类型；:右边表示相应的索引返回值类型，即当用string类型的key去索引MethodOptions，会得到函数类型的返回值
}
type Storage<D = {}, M extends MethodOptions = {}> = NonNullable<D> & NonNullable<M>;

type StorageOptions<D = {}, M extends MethodOptions = {}> = ThisType<Storage<D, M>> & {
  data?: D;
  methods?: M;
};

export function createStorage<D = {}, M extends MethodOptions = {}>(options: StorageOptions<D, M>) {
  const $storage = reactive({} as Storage<D, M>);
  type $Storage = typeof $storage;
  if (options.data !== undefined) {
    for (const [key, val] of Object.entries(options.data)) {
      $storage[key as keyof $Storage] = val;
    }
  }
  if (options.methods !== undefined) {
    for (const [key, val] of Object.entries(options.methods)) {
      $storage[key as keyof $Storage] = val.bind($storage);
    }
  }
  const $injectKey = Symbol() as InjectionKey<typeof $storage>;
  return {
    install(app: App) {
      app.provide($injectKey, $storage);
      app.config.globalProperties.$storage = $storage;
    },
    $storage,
    $injectKey,
  };
}

export function useStorage<S>(injectKey: InjectionKey<S>): S {
  return inject(injectKey)!;
}
