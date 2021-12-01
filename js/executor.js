var editor = CodeMirror.fromTextArea(document.getElementById("area"), {
    lineNumbers: true,
    
  });
  

  let compiler;
  function check(){
    document.getElementById("console").innerText=""
    let lang=document.getElementById("lang").value

    switch (lang) {
        case "0":
            compiler="cg63"
            break;
        case "1":
            compiler="g82"
            break
        case "2":
            compiler="python310"
            
            break
        case "3":
            compiler="gfortran94"
            break
        
        default:
       
            break;
    }
    
console.log(lang)
console.log(compiler)

    let data={
"source": editor.getValue(),
"compiler": compiler,
"options": {
    "userArguments": "-O3",
    "executeParameters": {
        "args": ["arg1", "arg2"],
        "stdin": document.getElementById("stdin").value,
    },
    "compilerOptions": {
        "executorRequest": true
    },
    "filters": {
        "execute": true
    },
    "tools": [],
    "libraries": [
        {"id": "openssl", "version": "111c"}
    ]
},
"allowStoreCodeDebug": true
}
    fetch(`https://gcc.godbolt.org/api/compiler/${compiler}/compile`,
    {
        headers : { 
    'Content-Type': 'application/json',
    'Accept': 'application/json'
   },
        method:"POST",
        body:JSON.stringify(data)
    }
    ).then((res)=>
        res.json()
    )
    .then((data)=>{
        console.log(data)
        if(data.code==0){
            document.getElementById("console").innerText=`${data.stdout[0].text}`
        }
        else {
                    if(data.buildResult.stderr){
                        for(var i=0;i<data.buildResult.stderr.length;i++){
                            document.getElementById("console").innerText+=`${data.buildResult.stderr[i].text}\n`
                        }
                    }else{
                        for(var i=0;i<data.stderr.length;i++){
                            document.getElementById("console").innerText+=`${data.stderr[i].text}\n`
                        }
                    }
           
           
            
        }
        
    })
   
  }