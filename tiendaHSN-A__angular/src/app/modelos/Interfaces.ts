export interface IRespuestaNode {
  codigo: string,
  mensaje: string,
  datos?: any
}

export interface IFormRegistro {
    nombre: string,
    apellidos: string,
    email: string,
    password: string,
    planAmigo?: string,
    genero: string
}
