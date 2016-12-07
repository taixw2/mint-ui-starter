module.exports = [

    {
      path : "/",
      name : "Index",
      children : [
        path : "/",
        name : "index",
        component : require("./index.vue")
      ]
    }

]
