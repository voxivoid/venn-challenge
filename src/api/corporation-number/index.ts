// Public surface of the module. Test handlers are imported from
// `./corporation-number.handlers` directly, so MSW never reaches the app bundle.
export {
  corporationNumberQuery,
  getCorporationNumber,
  useCheckCorporationNumber,
  type CorporationNumberResponse,
} from "./corporation-number";
