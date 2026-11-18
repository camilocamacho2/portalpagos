require('dotenv').config()
const express = require('express')
const app = express()
const port = process.env.PORT
const mongoose = require('mongoose');
const connectionstring = process.env.MONGO_URL
let connectedtodb = false;
const bcrypt = require('bcrypt')
const conectarDB = require('./db');
const UsuarioModel = require("./models/Usuario");
const ProductosModel = require("./models/Productos");
const jwt = require('jsonwebtoken')
const cors = require('cors')

app.use(express.json())
app.use(cors())

const iniciarServidor = async () => {
  await conectarDB();
  const server = app.listen(port, () => console.log("Servidor escuchando por: " + port))
}


iniciarServidor();

const rutasProtegidas = express.Router()

rutasProtegidas.use((req, res, next) =>{
	const token = req.headers['access-token']
	if(token){
		jwt.verify(token, "estaeslallave", (err , decoded) =>{
			if(err){
				return res.json({mensaje : 'Token invalido'})
			}else{
				req.decoded = decoded
				next()
			}
		})
	}else{
		res.send({
			mensaje : 'Token vacio'
		})
	}
})


app.get('/', (req, res) => {
	console.log("He escuchado el request get")
    let payload = {
        mensaje : "Test OK"
    }
	res.send(payload)

})

app.post('/registro', async(req, res) => {
let usuario = req.body
	if(usuario){
		usuario.datetime =  new Date();
		usuario.clave = await bcrypt.hash(usuario.clave, 10)
		console.log(usuario)
		let registro = new UsuarioModel(usuario);
		let payload = {
			registro : registro,
			mensaje : ""		
		}
		registro.save().then(item => {
			console.log("item saved to database");
			payload.mensaje = "guardado en base de datos"
			res.send(payload)
		}).catch(err => {
			console.log("unable to save to database: " + err.toString());
			payload.mensaje = err.toString()
			res.send(payload)
		});
		
	}else{
		let payload = {
			mensaje : "body vacio"			
		}
		res.send(payload)
	}

} )

app.post('/login', async (req, res) =>{
	let usuario = req.body
	console.log(usuario)
	if(usuario){
		let cedula = usuario.cedula
		let clave = usuario.clave

        let query = { "cedula" : cedula };

        const usuariodb = await UsuarioModel.findOne(query)
        if(usuariodb){
            let payload = {
                mensaje : "ok",
            }
            try{
	    		let clave_en_db = usuariodb.clave
	    		if(await bcrypt.compare(clave, clave_en_db)){
	    			payload.check = true
	    			payload.mensaje = "login correcto"
	    			const token = jwt.sign(payload, "estaeslallave", {
	    				expiresIn : 60
	    			})
	    			payload.token = token    			
	    			res.send(payload) 
	    		}else{
	    			payload.mensaje = "usuario o clave incorrectos"
	    			res.send(payload) 
	    		}
	    	}catch(error){
                payload.error = error
	    		payload.mensaje = "usuario o clave incorrectos"
	    		res.send(payload) 
	    	}

        }else{
            let payload = {
                mensaje : "usuario o clave incorrectos",
            }
            res.send(payload)
        }
    }else{
        let payload = {
            mensaje : "parametros incorrectos"
        }
        res.send(payload)
    }
})

app.post('/agregarproducto', rutasProtegidas, (req,res)=>{
    let producto = req.body
    let payload = {
        mensaje : ""
    }
    if(producto){
        producto.fecha = new Date()
        let registro = new ProductosModel(producto);
        registro.save(producto).then(item => {
			console.log("item saved to database");
			payload.mensaje = "guardado en base de datos"
			res.send(payload)
		}).catch(err => {
			console.log("unable to save to database: " + err.toString());
			payload.mensaje = err.toString()
			res.send(payload)
		});
    }else{
        payload.mensaje = "parametros incorrectos"
		res.send(payload)
    }
})


app.post('/traerUsuarios', rutasProtegidas,async (req, res) =>{
	let usuario = req.body

        let query = { };

        const usuariodb = await UsuarioModel.find(query)
        if(usuariodb){
            let payload = {
                mensaje : "ok",
				datos : usuariodb
            }
			res.send(payload)
        }else{
            let payload = {
                mensaje : "No hay registros",
            }
            res.send(payload)
        }
    
})
