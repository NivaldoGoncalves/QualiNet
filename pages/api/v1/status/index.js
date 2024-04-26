function status(request, response){
    response.status(200).json ({"chave" : "Api Status QualiNet"})
}

export default status