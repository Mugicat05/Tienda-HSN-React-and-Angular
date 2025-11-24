export default interface IDatosRegistro {
    nombre: string;
    apellidos: string;
    genero: string;
    email: string;
    password: string;
    planAmigo?: string; //opcional
}