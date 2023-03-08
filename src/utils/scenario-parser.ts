function loadXML(xmlString: string) {
  if (window.DOMParser && document.implementation) {
    try {
      const domParser = new DOMParser();
      const xmlDoc = domParser.parseFromString(xmlString, "text/xml");
      // console.log("xmlDoc", xmlDoc);
      return xmlDoc;
    } catch (e) {
      console.log("加载 XML 出现异常：", e);
    }
  }
  return null;
}

function handleForceSides(forceSides: Element) {
  const forceSideElements = forceSides.getElementsByTagName("ForceSide");
  return Array.from(forceSideElements).map((item) => {
    let units: string[];

    const unitsElements = item.getElementsByTagName("Units");
    if (unitsElements.length > 0) {
      const unitElements = unitsElements[0].getElementsByTagName("Unit");
      units = Array.from(unitElements).map((item) => item.getAttribute("id") ?? "");
    } else {
      units = [];
    }

    return {
      id: item.getAttribute("id") ?? "",
      name: item.getAttribute("name") ?? "",
      color: item.getAttribute("color") ?? "",
      units,
    };
  });
}

function handleEntities(entities: Element) {
  const entityElements = entities.getElementsByTagName("Entity");
  return Array.from(entityElements).map((item) => {
    const parametersElement = item.getElementsByTagName("Parameters")[0];
    const parameterElements = parametersElement.getElementsByTagName("Parameter");

    const parameters = Array.from(parameterElements).map((item) => {
      return {
        name: item.getAttribute("name") ?? "",
        displayName: item.getAttribute("displayName") ?? "",
        type: item.getAttribute("type") ?? "",
        usage: item.getAttribute("usage") ?? "",
        value: item.getAttribute("value") ?? "",
      };
    });
    return {
      id: item.getAttribute("id") ?? "",
      modelID: item.getAttribute("modelID") ?? "",
      name: item.getAttribute("entityName") ?? "",
      displayName: item.getAttribute("modelDisplayName") ?? "",
      parameters,
    };
  });
}

/* 想定 xml 转 obj */
export function scenarioFile2Obj(base64String: string) {
  try {
    const xmlDoc = loadXML(decodeURIComponent(escape(window.atob(base64String))));

    if (xmlDoc) {
      const scenarioInfo = xmlDoc.getElementsByTagName("ScenarioInfo")[0];
      const scenarioName = scenarioInfo.getElementsByTagName("Name")[0];
      const scenarioDescription = scenarioInfo.getElementsByTagName("Description")[0];

      const forceSides = scenarioInfo.getElementsByTagName("ForceSides")[0];
      const entities = scenarioInfo.getElementsByTagName("Entities")[0];

      const forceSidesResult = handleForceSides(forceSides);
      const entitiesResult = handleEntities(entities);
      return {
        name: scenarioName?.innerHTML ?? "",
        description: scenarioDescription?.innerHTML ?? "",
        forceSides: forceSidesResult,
        entities: entitiesResult,
      };
    }
  } catch (e) {
    console.log("解析想定文件出现异常：", e);
  }
  return null;
}

/* 模型配置 xml 转 obj */
export function modelConfigFile2Obj(base64String: string) {
  try {
    const xmlDoc = loadXML(decodeURIComponent(escape(window.atob(base64String))));
    console.log(xmlDoc);
    if (xmlDoc) {
      const modelInfoElement = xmlDoc.getElementsByTagName("ModelInfo")[0];

      const parametersElement = modelInfoElement.getElementsByTagName("Parameters")[0];
      const parameterElements = parametersElement.getElementsByTagName("Parameter");
      const parameters = Array.from(parameterElements).map((item) => {
        return {
          name: item.getAttribute("name") ?? "",
          displayName: item.getAttribute("displayName") ?? "",
          type: item.getAttribute("type") ?? "",
          usage: item.getAttribute("usage") ?? "",
          value: item.getAttribute("value") ?? "",
        };
      });
      return {
        id: modelInfoElement.getAttribute("id") ?? "",
        modelID: modelInfoElement.getAttribute("modelID") ?? "",
        name: modelInfoElement.getAttribute("name") ?? "",
        displayName: modelInfoElement.getAttribute("displayName") ?? "",
        parameters,
      };
    }
  } catch (e) {
    console.log("解析模型配置出现异常：", e);
  }
  return null;
}
/*实体组装树结构*/
export function aryToTree(enterAry: any[]) {
  let outAry: { pid: number; id: number; label: any; children: any[] }[] = [];
  let id = 0;
  let labelAry: any[] = [];
  let childrenlabelAry: any[] = [];
  enterAry.forEach((item: { camp_name: any; model_name: any; id: any; name: any; model_id: any }) => {
    if (!labelAry.includes(item.camp_name)) {
      labelAry.push(item.camp_name);
      outAry.push({ pid: 0, id: id, label: item.camp_name, children: [] });
      id++;
    }
    outAry.forEach((ele) => {
      if (ele.label == item.camp_name) {
        labelAry.push(item.camp_name);
        if (!childrenlabelAry.includes(item.model_name)) {
          childrenlabelAry.push(item.model_name);
          ele.children.push({
            id: id,
            pid: ele.id,
            children: [],
            label: item.model_name,
          });
          id++;
        }
      }
      ele.children.forEach(
        (ment: {
          label: any;
          children: {
            uid: string;
            pid: number;
            label: string;
            modelName: string;
            id: number;
            model_id: any;
            camp_name: string;
          }[];
          id: any;
        }) => {
          if (ment.label == item.model_name) {
            ment.children.push({
              uid: item.id,
              pid: ment.id,
              label: item.name,
              modelName: item.model_name,
              id: id,
              model_id: item.model_id,
              camp_name: item.camp_name,
            });
            id++;
          }
        }
      );
    });
  });
  return outAry;
}
