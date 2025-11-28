import { HttpInterceptorFn, HttpRequest, HttpResponse, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';

const STORAGE_KEY = 'httpRequestCache_v1';

//mejoras a implementar en el interceptor de cache:
// - limitar el tamaño maximo de la cache (numero maximo de entradas o tamaño en bytes)
// - implementar un sistema de expiracion de entradas en la cache (tiempo maximo de vida de una entrada)
// - implementar un sistema de invalidacion de la cache (borrar entradas cuando se hacen peticiones POST/PUT/DELETE) 


type StoredResponse = {
  status: number;
  statusText: string;
  headers: { [key: string]: string[] } | null;
  body: any;
};

function headersToObject(headers: HttpHeaders): { [key: string]: string[] } {
  const obj: { [key: string]: string[] } = {};
  headers.keys().forEach((k) => {
    obj[k] = headers.getAll(k) || [];
  });
  return obj;
}

function objectToHeaders(obj: { [key: string]: string[] } | null): HttpHeaders {
  let headers = new HttpHeaders();
  if (!obj) return headers;
  Object.keys(obj).forEach((k) => {
    const values = obj[k] || [];
    values.forEach((v) => {
      headers = headers.append(k, v);
    });
  });
  return headers;
}

function saveCacheToLocalStorage(map: Map<string, StoredResponse>) {
  try {
    const arr = Array.from(map.entries());
    localStorage.setItem(STORAGE_KEY, JSON.stringify(arr));
  } catch (e) {
    console.warn('No se pudo guardar la cache en localStorage', e);
  }
}

function loadCacheFromLocalStorage(): Map<string, StoredResponse> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return new Map<string, StoredResponse>();
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return new Map<string, StoredResponse>();
    return new Map<string, StoredResponse>(parsed as Array<[string, StoredResponse]>);
  } catch (e) {
    console.warn('Cache en localStorage corrupta o inaccesible, se crea una nueva.', e);
    try { localStorage.removeItem(STORAGE_KEY); } catch (_) {}
    return new Map<string, StoredResponse>();
  }
}

// Cache en memoria (se inicializa desde localStorage)
const cacheMap: Map<string, StoredResponse> = loadCacheFromLocalStorage();

export const cacheRequestsInterceptor: HttpInterceptorFn = (req, next) => {
  // Sólo cacheamos peticiones GET (evitar cachear POST/PUT/DELETE)
  if (req.method !== 'GET') {
    return next(req);
  }

  const url = (req as HttpRequest<any>).urlWithParams;

  // Intentar recuperar de la cache en memoria
  const cached = cacheMap.get(url);
  if (cached) {
    // Reconstruir HttpResponse a partir del objeto almacenado
    const response = new HttpResponse({
      body: cached.body,
      status: cached.status,
      statusText: cached.statusText,
      headers: objectToHeaders(cached.headers),
      url
    });
    // Devolver observable con la respuesta cacheada sin llamar a next(req)
    return of(response);
  }

  // Si no hay cache, realizar la petición y almacenar la respuesta en la cache
  return next(req).pipe(
    tap((event) => {
      if (event instanceof HttpResponse) {
        const toStore: StoredResponse = {
          status: event.status,
          statusText: event.statusText,
          headers: event.headers ? headersToObject(event.headers) : null,
          body: event.body
        };
        cacheMap.set(url, toStore);
        saveCacheToLocalStorage(cacheMap);
      }
    })
  );
}; 