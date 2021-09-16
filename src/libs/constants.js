module.exports = {
    SETTINGS : {
    DB : {
      HOST: "127.0.0.1",
      PORT: 3306,
      USERNAME: "root",
      PASSWORD: "mysecretpassword"
    },
    DBNAME : {
      NAME: "santra"
    },
    WEB : {
      PORT:3010
    }
  },
  
  CLASSES : {
    VERTICES : {
      VERTICES: "V",
      CONTACT: "Contact",
      CONTENT: "Content",
      DATASOURCES: "Datasources",
      INSTITUTES: "Institutes",
      MAINNODES: "MainNodes",
      SUBNODES: "SubNodes",
      NODES: "Nodes",
      PROJECTS: "Projects",
      TAGS: "Tags",
    },
    EDGES : {
      HAS_AFTER: "hasAfter",
      HAS_CONTACT: "hasContact",
      HAS_CONTENT: "hasContent",
      HAS_DATASOURCE: "hasDatasource",
      HAS_INSTITUTE: "hasInstitute",
      HAS_PREVIOUS: "hasPrevious",
      HAS_PROJECT: "hasProject",
      HAS_TAG: "hasTag",
      PROPOSED: "proposed",
      RELATED: "related"
    }
  },
  
  PATHS : {
    JQUERY: "../node_modules/jquery/dist/",
    D3: "../node_modules/d3/build/",
    BOOTSTRAP: "../node_modules/bootstrap/dist/",
    STATIC: "public"
  }

}
  