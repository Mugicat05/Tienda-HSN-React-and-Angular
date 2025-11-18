import "./LibretaDirecciones.css";
import useGlobalState from "../../../../globalState/GlobalState";
import { useState } from "react";
import MiniDireccion from "./MiniDireccionComp/MiniDireccion";
import ModalDirecciones from "./ModalDireccionesComp/ModalDirecciones";

function LibretaDirecciones() {
  const { cliente, setCliente, accessToken, refreshToken, setAccessToken } =
    useGlobalState();

  const direcciones = cliente?.direcciones || [];

  const [mensaje, setMensaje] = useState(null);
  const [direccionAEliminar, setDireccionAEliminar] = useState(null);
  const [direccionAModificar, setDireccionAModificar] = useState(null);

  const handleSolicitarEliminar = (direccion) => {
    setDireccionAEliminar(direccion);
    setMensaje(null);
  };

  const handleCancelarEliminar = () => {
    setDireccionAEliminar(null);
  };

  const handleConfirmarEliminar = async () => {
    if (!direccionAEliminar) return;

    try {
      const res = await fetch("http://localhost:3000/api/Cliente/Direccion", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
          "X-REFRESH-TOKEN": refreshToken,
        },
        body: JSON.stringify({
          clienteId: cliente._id,
          accion: "eliminarDireccion",
          payload: direccionAEliminar,
        }),
      });
      const nuevoToken = res.headers.get("X-ACCESS-TOKEN");
      if (nuevoToken) {
        setAccessToken(nuevoToken);
        localStorage.setItem("accessToken", nuevoToken); // esto es opcional, no es obligatorio,
                                                         //si lo quitamos funciona, pero es recomendable por la persistencia
      }

      const data = await res.json();
      if (!res.ok || data.codigo !== 0) throw new Error(data.mensaje);

      setCliente(data.clienteActualizado);
      setMensaje({
        tipo: "success",
        texto: "Dirección eliminada correctamente.",
      });
    } catch (error) {
      setMensaje({ tipo: "error", texto: error.message });
    } finally {
      const modalEl = document.getElementById("modalConfirmarEliminar");
      if (modalEl) {
        const modal = window.bootstrap.Modal.getInstance(modalEl);
        if (modal) modal.hide();
      }
      setDireccionAEliminar(null);
    }
  };

  const handleSolicitarModificar = (direccion, tipoAccion) => {
    setMensaje(null);

    if (tipoAccion === "editar" || !direccion._id) {
      setDireccionAModificar(direccion);
    } else {
      const actualizada = {
        ...direccion,
        esPrincipal:
          tipoAccion === "envio" || tipoAccion === "facturacionEnvio",
        esFacturacion:
          tipoAccion === "facturacion" || tipoAccion === "facturacionEnvio",
      };
      handleModificarDirecto(actualizada);
    }
  };

  const handleModificarDirecto = async (direccionModificada) => {
    try {
      const res = await fetch("http://localhost:3000/api/Cliente/Direccion", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
          "X-REFRESH-TOKEN": refreshToken,
        },
        body: JSON.stringify({
          clienteId: cliente._id,
          accion: "modificarDireccion",
          payload: direccionModificada,
        }),
      });
      const nuevoToken = res.headers.get("X-ACCESS-TOKEN");
      if (nuevoToken) {
        setAccessToken(nuevoToken);
        localStorage.setItem("accessToken", nuevoToken); // opcional si usas persistencia
      }

      const data = await res.json();
      if (!res.ok || data.codigo !== 0) throw new Error(data.mensaje);

      setCliente(data.clienteActualizado);
      setMensaje({
        tipo: "success",
        texto: "Dirección actualizada correctamente.",
      });
    } catch (error) {
      setMensaje({ tipo: "error", texto: error.message });
    }
  };

  const direccionPrincipal = direcciones.find((d) => d.esPrincipal);
  const direccionFacturacion = direcciones.find((d) => d.esFacturacion);
  const direccionesAdicionales = direcciones.filter(
    (d) => !d.esPrincipal && !d.esFacturacion
  );

  return (
    <div className="container">
      <div className="row m-4">
        <div className="col-12">
          <h2>Libreta de Direcciones</h2>
          <hr />
          <p>Gestiona tus direcciones de envío y facturación.</p>
        </div>
      </div>

      {mensaje && (
        <div className="row m-4">
          <div className="col-12">
            <div
              className={`alert ${
                mensaje.tipo === "success" ? "alert-success" : "alert-danger"
              }`}
              role="alert"
            >
              {mensaje.texto}
            </div>
          </div>
        </div>
      )}

      {/* Dirección principal */}
      <div className="row m-4">
        <div className="col-12">
          {direccionPrincipal ? (
            <MiniDireccion
              direccion={direccionPrincipal}
              onSolicitarEliminar={handleSolicitarEliminar}
              onSolicitarModificar={handleSolicitarModificar}
            />
          ) : (
            <p>No hay dirección principal definida.</p>
          )}
        </div>
      </div>

      {/* Dirección de facturación */}
      <div className="row m-4">
        <div className="col-12">
          {direccionFacturacion &&
          (!direccionPrincipal ||
            direccionFacturacion._id !== direccionPrincipal._id) ? (
            <MiniDireccion
              direccion={direccionFacturacion}
              onSolicitarEliminar={handleSolicitarEliminar}
              onSolicitarModificar={handleSolicitarModificar}
            />
          ) : (
            !direccionFacturacion && (
              <p>No hay dirección de facturación definida.</p>
            )
          )}
        </div>
      </div>

      {/* Direcciones adicionales */}
      <div className="row m-4">
        <div className="col-12">
          <h5>Direcciones adicionales</h5>
          <hr />
          <p>Añade, edita o elimina direcciones adicionales.</p>
        </div>
      </div>

      {direccionesAdicionales.length > 0 ? (
        direccionesAdicionales.map((dir, i) => (
          <div className="row m-4" key={dir._id || i}>
            <div className="col-12">
              <MiniDireccion
                direccion={dir}
                onSolicitarEliminar={handleSolicitarEliminar}
                onSolicitarModificar={handleSolicitarModificar}
              />
            </div>
          </div>
        ))
      ) : (
        <div className="row m-4 border">
          <div className="col-12">
            <p>No tienes direcciones adicionales.</p>
          </div>
        </div>
      )}

      {/* añadir direccion, con sets en null */}
      <div className="row m-4">
        <div className="col-12 d-flex justify-content-end">
          <button
            type="button"
            className="btn btn-hsn-1"
            data-bs-toggle="modal"
            data-bs-target="#modalDirecciones"
            onClick={() => {
              setDireccionAModificar(null);
              setMensaje(null);
            }}
          >
            <i className="fa-solid fa-plus"></i> AÑADIR DIRECCIÓN
          </button>
        </div>
      </div>

      {/* Modales */}
      <ModalDirecciones
        setMensaje={setMensaje}
        direccionAModificar={direccionAModificar}
        setDireccionAModificar={setDireccionAModificar}
      />

      <div
        className="modal fade"
        id="modalConfirmarEliminar"
        tabIndex="-1"
        aria-labelledby="modalConfirmarLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="modalConfirmarLabel">
                Confirmar Eliminación
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                onClick={handleCancelarEliminar}
              ></button>
            </div>
            <div className="modal-body">
              <p>¿Estás seguro de que deseas eliminar esta dirección?</p>
              {direccionAEliminar && (
                <div className="card-text bg-light p-3 border rounded">
                  <p className="fw-bold mb-1">
                    {direccionAEliminar.nombre} {direccionAEliminar.apellidos}
                  </p>
                  <p className="mb-1">
                    {direccionAEliminar.direccion} {direccionAEliminar.numero}
                  </p>
                  <p className="mb-0">
                    {direccionAEliminar.codigoPostal} -{" "}
                    {direccionAEliminar.municipio}
                  </p>
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
                onClick={handleCancelarEliminar}
              >
                Cancelar
              </button>
              <button
                type="button"
                className="btn btn-danger"
                onClick={handleConfirmarEliminar}
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LibretaDirecciones;
