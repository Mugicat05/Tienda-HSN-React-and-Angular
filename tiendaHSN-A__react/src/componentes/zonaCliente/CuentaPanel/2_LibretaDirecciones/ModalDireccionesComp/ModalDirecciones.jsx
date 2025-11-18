import "./ModalDirecciones.css";
import { useState, useEffect } from "react";
import useGlobalState from "../../../../../globalState/GlobalState";

function ModalDirecciones({
  direccionAModificar,
  setDireccionAModificar,
  setMensaje,
}) {
  const { cliente, setCliente, accessToken, refreshToken, setAccessToken } =
    useGlobalState();
  const [provincias, setProvincias] = useState([]);
  const [municipios, setMunicipios] = useState([]);
  const [provinciaSeleccionada, setProvinciaSeleccionada] = useState("");

  const [form, setForm] = useState({
    nombre: "",
    apellidos: "",
    empresa: "",
    telefono: "",
    direccion: "",
    provincia: "",
    municipio: "",
    codigoPostal: "",
    pais: "España",
    esFacturacion: false,
    esPrincipal: false,
  });

  const esEdicion = !!direccionAModificar;
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (direccionAModificar?.reset || !direccionAModificar) {
      setForm({
        nombre: "",
        apellidos: "",
        empresa: "",
        telefono: "",
        direccion: "",
        provincia: "",
        municipio: "",
        codigoPostal: "",
        pais: "España",
        esFacturacion: false,
        esPrincipal: false,
      });
      setProvinciaSeleccionada("");
      setMunicipios([]);
      return;
    }

    // Si hay datos para editar
    setForm({
      _id: direccionAModificar._id || "",
      nombre: direccionAModificar.nombre || "",
      apellidos: direccionAModificar.apellidos || "",
      empresa: direccionAModificar.empresa || "",
      telefono: direccionAModificar.telefono || "",
      direccion: direccionAModificar.direccion || "",
      provincia: direccionAModificar.provincia || "",
      municipio: direccionAModificar.municipio || "",
      codigoPostal: direccionAModificar.codigoPostal || "",
      pais: direccionAModificar.pais || "España",
      esFacturacion: direccionAModificar.esFacturacion || false,
      esPrincipal: direccionAModificar.esPrincipal || false,
    });
    setProvinciaSeleccionada(direccionAModificar.provincia || "");
  }, [direccionAModificar]);

  useEffect(() => {
    fetch("http://localhost:3000/api/GeoAPI/geoapi", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        "X-REFRESH-TOKEN": refreshToken,
      },
      body: JSON.stringify({ accion: "obtenerProvincias" }),
    })
      .then((res) => res.json())
      .then((data) => setProvincias(Array.isArray(data) ? data : []))
      .catch((err) => console.error("Error al obtener provincias:", err));
  }, []);

  useEffect(() => {
    if (!provinciaSeleccionada) return;

    fetch("http://localhost:3000/api/GeoAPI/geoapi", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        "X-REFRESH-TOKEN": refreshToken,
      },
      body: JSON.stringify({
        accion: "obtenerMunicipios",
        codigoProvincia: provinciaSeleccionada,
      }),
    })
      .then((res) => res.json())
      .then((data) => setMunicipios(Array.isArray(data) ? data : []))
      .catch((err) => console.error("Error al obtener municipios:", err));
  }, [provinciaSeleccionada]);

  const isFormValid = () => {
    return (
      form.nombre.trim() &&
      form.apellidos.trim() &&
      form.telefono.trim() &&
      form.direccion.trim() &&
      form.provincia &&
      form.municipio &&
      form.codigoPostal.trim() &&
      form.pais.trim()
    );
  };

  const handleCerrarModal = () => {
    setDireccionAModificar(null);
  };
  console.log("Headers enviados:");
  console.log("Authorization:", `Bearer ${accessToken}`);
  console.log("X-REFRESH-TOKEN:", refreshToken);

  const handleGuardar = async () => {
    setIsLoading(true);
    if (!accessToken || !refreshToken || !cliente?._id) {
      console.warn(
        "Tokens no disponibles aún. Esperando restauración del estado."
      );
      return;
    }

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
          accion: esEdicion ? "modificarDireccion" : "añadirDireccion",
          payload: form,
        }),
      });
      const nuevoToken = res.headers.get("X-ACCESS-TOKEN");
      if (nuevoToken) setAccessToken(nuevoToken);

      const data = await res.json();
      if (!res.ok || data.codigo !== 0)
        throw new Error(data.mensaje || "Error al guardar dirección");

      setCliente(data.clienteActualizado);
      setMensaje({
        tipo: "success",
        texto: "Dirección guardada correctamente.",
      });

      // ns pero me da fallos y no es capaz de cerrar, asi que aplico esta funcion que me dio la IA
      const modalEl = document.getElementById("modalDirecciones");
      if (modalEl) {
        const modal = window.bootstrap.Modal.getInstance(modalEl);
        if (modal) modal.hide();
      }

      // que no se quede guardado en "cache", para que no vuelva a aparecer(lo dejamos en null y ya)
      setDireccionAModificar(null);
    } catch (error) {
      setMensaje({ tipo: "error", texto: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="modal fade"
      id="modalDirecciones"
      data-bs-backdrop="static"
      data-bs-keyboard="false"
      tabIndex="-1"
      aria-labelledby="modalDireccionesLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h2 className="modal-title fs-5" id="modalDireccionesLabel">
              Alta de nueva Dirección / Editar Dirección
            </h2>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
              onClick={handleCerrarModal}
            ></button>
          </div>
          <div className="modal-body">
            <div className="container">
              <div className="row mt-2">
                <div className="col-12">
                  <h5 style={{ borderBottom: "1px solid #ccc" }}>
                    Información de contacto
                  </h5>
                </div>
              </div>

              <div className="row">
                <div className="col-md-6">
                  <input
                    type="text"
                    className="form-control mb-3"
                    placeholder="Nombre *"
                    value={form.nombre}
                    onChange={(e) =>
                      setForm({ ...form, nombre: e.target.value })
                    }
                  />
                </div>
                <div className="col-md-6">
                  <input
                    type="text"
                    className="form-control mb-3"
                    placeholder="Apellidos *"
                    value={form.apellidos}
                    onChange={(e) =>
                      setForm({ ...form, apellidos: e.target.value })
                    }
                  />
                </div>
              </div>

              <input
                type="text"
                className="form-control mb-3"
                placeholder="Empresa"
                value={form.empresa}
                onChange={(e) => setForm({ ...form, empresa: e.target.value })}
              />
              <input
                type="text"
                className="form-control mb-3"
                placeholder="Teléfono *"
                value={form.telefono}
                onChange={(e) => setForm({ ...form, telefono: e.target.value })}
              />

              <h5 className="mt-4" style={{ borderBottom: "1px solid #ccc" }}>
                Datos de dirección
              </h5>
              <input
                type="text"
                className="form-control mb-3"
                placeholder="Dirección *"
                value={form.direccion}
                onChange={(e) =>
                  setForm({ ...form, direccion: e.target.value })
                }
              />

              <div className="row">
                <div className="col-md-6">
                  <select
                    className="form-select mb-3"
                    value={form.municipio}
                    onChange={(e) =>
                      setForm({ ...form, municipio: e.target.value })
                    }
                  >
                    <option value="">Selecciona un municipio</option>
                    {municipios.map((m) => (
                      <option key={m.CMUM} value={m.DMUN50}>
                        {m.DMUN50}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-md-6">
                  <select
                    className="form-select mb-3"
                    value={form.provincia}
                    onChange={(e) => {
                      setProvinciaSeleccionada(e.target.value);
                      setForm({
                        ...form,
                        provincia: e.target.value,
                        municipio: "",
                      });
                    }}
                  >
                    <option value="">Selecciona una provincia</option>
                    {provincias.map((p) => (
                      <option key={p.CPRO} value={p.CPRO}>
                        {p.PRO}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="row">
                <div className="col-md-6">
                  <input
                    type="text"
                    className="form-control mb-3"
                    placeholder="Código Postal *"
                    value={form.codigoPostal}
                    onChange={(e) =>
                      setForm({ ...form, codigoPostal: e.target.value })
                    }
                  />
                </div>
                <div className="col-md-6">
                  <input
                    type="text"
                    className="form-control mb-3"
                    placeholder="País *"
                    value={form.pais}
                    onChange={(e) => setForm({ ...form, pais: e.target.value })}
                  />
                </div>
              </div>

              <div className="row">
                <div className="col-md-12">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="checkFacturacion"
                    checked={form.esFacturacion}
                    onChange={(e) =>
                      setForm({ ...form, esFacturacion: e.target.checked })
                    }
                    style={{
                      opacity: 1,
                      display: "flex",
                      alignItems: "center",
                    }}
                  />
                  <label
                    className="form-check-label"
                    htmlFor="checkFacturacion"
                  >
                    Direccion de Facturacion
                  </label>
                </div>
              </div>

              <div className="row">
                <div className="col-md-12">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="checkEnvio"
                    checked={form.esPrincipal}
                    onChange={(e) =>
                      setForm({ ...form, esPrincipal: e.target.checked })
                    }
                    style={{
                      opacity: 1,
                      display: "flex",
                      alignItems: "center",
                    }}
                  />
                  <label className="form-check-label" htmlFor="checkEnvio">
                    Direccion de envio predeterminada (principal)
                  </label>
                </div>
              </div>

              <div className="d-flex justify-content-end">
                <button
                  type="button"
                  className="btn btn-hsn-1"
                  disabled={!isFormValid() || isLoading}
                  onClick={handleGuardar}
                >
                  <i className="fa-solid fa-check"></i> GUARDAR CAMBIOS
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ModalDirecciones;
