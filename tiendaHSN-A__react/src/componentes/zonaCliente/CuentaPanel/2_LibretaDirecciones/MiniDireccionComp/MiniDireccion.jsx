import "./MiniDireccion.css";

function MiniDireccion({ direccion, onSolicitarEliminar, onSolicitarModificar }) {
  const esPrincipal = direccion.esPrincipal;
  const esFacturacion = direccion.esFacturacion;
  const esDestacada = esPrincipal || esFacturacion;

  const mostrarTexto = (valor) => {
    if (typeof valor === "string") return valor;
    if (typeof valor === "object" && valor?.DMUN50) return valor.DMUN50;
    if (typeof valor === "object" && valor?.PRO) return valor.PRO;
    return "";
  };

  const getEtiqueta = () => {
    if (esPrincipal && esFacturacion)
      return "📍 Dirección de envío/facturación predeterminada";
    if (esPrincipal) return "📦 Dirección de envío predeterminada";
    if (esFacturacion) return "🧾 Dirección de facturación predeterminada";
    return "📌 Dirección adicional";
  };

  return (
    <div className="card">
      <div className="card-body">
        <h5 className="card-title mb-2">
          {esDestacada && (
            <i className="fa-solid fa-star" style={{ color: "#ff6000", fontSize: "23px" }}></i>
          )}{" "}
          {getEtiqueta()}
        </h5>

        <div className="d-flex justify-content-between mb-2">
          <p className="card-text">
            {direccion.nombre} {direccion.apellidos}
          </p>

          {!esDestacada && (
            <div className="dropdown">
              <button
                className="btn btn-dropdown dropdown-toggle btn-sm"
                type="button"
                data-bs-toggle="dropdown"
              >
                <img
                  src="/images/3puntos-dropdown.svg"
                  alt="dropdown"
                  style={{ width: "4px", height: "17px" }}
                />
              </button>
              <ul className="dropdown-menu">
                <li>
                  <button
                    className="dropdown-item"
                    onClick={() =>  (direccion, "facturacionEnvio")}
                  >
                    Usar como dirección de facturación y envío por defecto
                  </button>
                </li>
                <li>
                  <button
                    className="dropdown-item"
                    onClick={() => onSolicitarModificar(direccion, "envio")}
                  >
                    Usar como dirección de envío por defecto
                  </button>
                </li>
                <li>
                  <button
                    className="dropdown-item"
                    onClick={() => onSolicitarModificar(direccion, "facturacion")}
                  >
                    Usar como dirección de facturación por defecto
                  </button>
                </li>
                <li>
                  <button
                    className="dropdown-item"
                    data-bs-toggle="modal"
                    data-bs-target="#modalDirecciones"
                    onClick={() => onSolicitarModificar(direccion, "editar")}
                  >
                    Modificar datos
                  </button>
                </li>
                <li>
                  <button
                    className="dropdown-item"
                    data-bs-toggle="modal"
                    data-bs-target="#modalConfirmarEliminar"
                    onClick={() => onSolicitarEliminar(direccion)}
                  >
                    Borrar la dirección
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>

        <p className="card-text">
          {direccion.direccion || ""} {direccion.numero || ""} {direccion.piso || ""} {direccion.escalera || ""}
        </p>

        <p className="card-text">
          {mostrarTexto(direccion.municipio)}, {mostrarTexto(direccion.provincia)}, {direccion.codigoPostal || ""}
        </p>

        <p className="card-text">{direccion.pais}</p>
        <p className="card-text">Teléfono: {direccion.telefono}</p>
        {direccion.email && <p className="card-text">Email: {direccion.email}</p>}
        {direccion.observaciones && <p className="card-text">📝 {direccion.observaciones}</p>}

        {esDestacada && (
          <div className="d-flex justify-content-end gap-2">
            <button
              className="btn btn-hsn-2 btn-sm"
              data-bs-toggle="modal"
              data-bs-target="#modalDirecciones"
              onClick={() => onSolicitarModificar(direccion, "editar")}
            >
              MODIFICAR
            </button>
            <button
              className="btn btn-hsn-2 btn-sm"
              data-bs-toggle="modal"
              data-bs-target="#modalConfirmarEliminar"
              onClick={() => onSolicitarEliminar(direccion)}
            >
              ELIMINAR
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default MiniDireccion;
