import { EditorState, EditorView, basicSetup } from "@codemirror/basic-setup";
import { keymap } from "@codemirror/view";
import { indentWithTab } from "@codemirror/commands";
import { StreamLanguage } from "@codemirror/stream-parser";
// import { python } from "@codemirror/legacy-modes/mode/python";
// import {json} from "@codemirror/legacy-modes/mode/javascript"
import { tags, HighlightStyle } from "@codemirror/highlight";
export default function () {
  function creatCodeMirror(id: string, codeContent: string, callback: Function,type="python") {
    debugger
    let language=type=="python"?python:json
    let editor = new EditorView({
      state: EditorState.create({
        extensions: [
          basicSetup,
          keymap.of([indentWithTab]),
          HighlightStyle.define([
            { tag: tags.keyword, color: "#fc6" },
            {
              tag: tags.comment,
              color: "green",
            },
            {
              tag: tags.name,
              color: "white",
            },
          ]),
          EditorView.theme(
            {
              "&.cm-focused .cm-cursor": {
                //光标颜色
                borderLeftColor: "#00e0ffff",
              },
              ".cm-gutters": {
                backgroundColor: "#045", //行号的背景色
                color: "#ddd", //行号的颜色
                border: "none",
              },
            },
            { dark: true }
          ),
          StreamLanguage.define(language),
          EditorView.updateListener.of((v) => {
            if (v.docChanged) {
              callback(v.state.doc.toString()); //内容改变的回调函数
            }
          }),
        ], //扩展
        doc: codeContent, //初始值
      }),
      parent: document.getElementById(id)!, //编辑器的容器
    });
    return editor;
  }
  return { creatCodeMirror };
}
