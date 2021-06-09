import nock from "nock";
import {
  DispatchResponse,
  V1RPCRoutes,
  ChallengeResponse,
  QueryAllParamsResponse,
} from "@pokt-network/pocket-js-rpc-models";

const envUrl = new URL("http://localhost:8081");
const addressHex = "84871BAF5B4E01BE52E5007EACF7048F24BF57E0";

/**
 *
 *
 * @class NockUtil
 */
export class NockUtil {
  /**
   * Raw Tx mocked response
   * @param {number} code - Http request status code, default 200.
   * @returns {nock.Scope} - A Nock scope with the raw tx response object.
   * @memberof NockUtil
   */
  public static mockRawTx(code: number = 200): nock.Scope {
    const data: any = this.createData(code, {
      height: "1",
      raw_log:
        '[{\\"msg_index\\":0,\\"success\\":true,\\"log\\":\\"\\",\\"events\\":[{\\"type\\":\\"message\\",\\"attributes\\":[{\\"key\\":\\"action\\",\\"value\\":\\"send\\"}]}]}]","logs":[{"msg_index":0,"success":true,"log":"","events":[{"type":"message","attributes":[{"key":"action","value":"send"}]}]}]',
      txhash:
        "1DE7AF0CDEF19B21D6BDE602A4916186E40D86854B2E747A464BD32C7616B5A2",
    });

    const response = this.getResponseObject(data, code);
    return this.nockRoute(
      V1RPCRoutes.ClientRawTx.toString(),
      code,
      response.data
    );
  }
  /**
   * Dispatch mocked response
   * @param {number} code - Http request status code, default 200.
   * @returns {nock.Scope} - A Nock scope with the dispatch response object.
   * @memberof NockUtil
   */
  public static mockDispatch(code: number = 200): nock.Scope {
    const dispatchResponse = DispatchResponse.fromJSON(
      '{"block_height":26260,"session":{"header":{"app_public_key":"a6588933478b72c6e0639fcbee7039e0ff28e323d712e69f269aa519fce93b61","chain":"0002","session_height":26257},"key":"SqX7bCSB+9o2FJ+r6M91waUNzo3/0V6Nf26x6ff3hjc=","nodes":[{"address":"b289b5f47165302cb8369aa7854c43fab805de45","chains":["0001","0002","0003","0004","0005","0006","0007","0008","0009","0010","0011","0012","0013","0021","0027"],"jailed":false,"public_key":"41401b10ebbbc41cc996c97c452f82dd4a90292b0eacfe916e87b0dc6257dd0b","service_url":"http://localhost:8081","status":2,"tokens":"15099969801","unstaking_time":"0001-01-01T00:00:00Z"},{"address":"633269f3f5a4cb7b6f224527bbeb550f2bc3571b","chains":["0001","0002","0003","0004","0005","0006","0009","0010","0011","0012","0021","0022","0025","0027","0028"],"jailed":false,"public_key":"83a848427f94d1d352b01c3d32cacd4617cc7f4a956df9859d115e7d61130c08","service_url":"http://localhost:8081","status":2,"tokens":"15199969601","unstaking_time":"0001-01-01T00:00:00Z"},{"address":"de24fc52321b2661995176eb996b26169e595aed","chains":["0001","0002","0003","0004","0005","0006","0007","0008","0009","0010","0011","0012","0013","0021","0027"],"jailed":false,"public_key":"fbb5e5c915e253e10403269e978fe6c70414c56a1f647df2693a1d401b1a9e73","service_url":"http://localhost:8081","status":2,"tokens":"15099984900","unstaking_time":"0001-01-01T00:00:00Z"},{"address":"2189325a17cc673060ba5a71d0e359388e7b9360","chains":["0001","0002","0003","0004","0005","0006","0009","0010","0011","0012","0021","0022","0025","0027","0028"],"jailed":false,"public_key":"5b3210eabe59db069255f12c230c9dfdf4244a440a4c2f5b70a6aa0fe157eb81","service_url":"http://localhost:8081","status":2,"tokens":"15199984800","unstaking_time":"0001-01-01T00:00:00Z"},{"address":"5b7a5f30e69cada0c89925b5700ddea41fda3819","chains":["0001","0002","0003","0004","0005","0006","0009","0010","0011","0012","0021","0022","0025","0027","0028"],"jailed":false,"public_key":"b4bd05765887810954465f206a1b0a6d90bc4c826b35e2cbb1e3dd25e7ed493e","service_url":"http://localhost:8081","status":2,"tokens":"15199969601","unstaking_time":"0001-01-01T00:00:00Z"}]}}'
    );

    const data: any = this.createData(code, dispatchResponse.toJSON());

    const response = this.getResponseObject(data, code);
    return this.nockRoute(
      V1RPCRoutes.ClientDispatch.toString(),
      code,
      response.data
    );
  }
  /**
   * Bad Dispatch mocked response
   * @param {number} code - Http request status code, default 200.
   * @returns {nock.Scope} - A Nock scope with the dispatch response object.
   * @memberof NockUtil
   */
  public static mockBadDispatch(code: number = 400): nock.Scope {
    const dispatchResponse = "400 Bad Request"

    const data: any = this.createData(code, dispatchResponse);

    const response = this.getResponseObject(data, code);
    return this.nockRoute(
      V1RPCRoutes.ClientDispatch.toString(),
      code,
      response.data
    );
  }
  /**
   * Send Consensus Relay mocked response
   * @param {number} code - Http request status code, default 200.
   * @returns {nock.Scope} - A Nock scope with the consensus relay response object.
   * @memberof NockUtil
   */
  public static mockRelayForConsensus(code: number = 200): nock.Scope {
    const relayResponse =
      '{"response":"{\\"id\\":67,\\"jsonrpc\\":\\"2.0\\",\\"result\\":\\"0x1043561a882930000\\"}","signature":"952352cc3b1e915c4470612e7f25b3cf811b30e1a95ab79d0c593d6afcbf0a7d0f50a945345e97c263641dfb8b1ba66911debe0be6d0586268720c3f9b83530f"}';

    const data: any = this.createData(code, relayResponse);

    const result = this.getResponseObject(data, code);
    return this.nockRoute(
      V1RPCRoutes.ClientRelay.toString(),
      code,
      result.data
    );
  }
  /**
   * Send Consensus Relay mocked response for failure scenario
   * @param {number} code - Http request status code, default 200.
   * @returns {nock.Scope} - A Nock scope with the consensus relay response object.
   * @memberof NockUtil
   */
  public static mockRelayForConsensusFailure(code: number = 200): nock.Scope {
    const relayResponse =
      '{"response":"{\\"id\\":67,\\"jsonrpc\\":\\"2.0\\",\\"result\\":\\"0x2043561a88111\\"}","signature":"952352cc3b1e915c4470612e7f25b3cf811b30e1a95ab79d0c593d6afcbf0a7d0f50a945345e97c263641dfb8b1ba66911debe0be6d0586268720c3f9b83530f"}';

    const data: any = this.createData(code, relayResponse);

    const result = this.getResponseObject(data, code);
    return this.nockRoute(
      V1RPCRoutes.ClientRelay.toString(),
      code,
      result.data
    );
  }
  /**
   * Query GetBlock mocked response
   * @param {number} code - Http request status code, default 200.
   * @returns {nock.Scope} - A Nock scope with the query getBlock response object.
   * @memberof NockUtil
   */
  public static mockGetBlock(code: number = 200): nock.Scope {
    const block =
      '{ "block": { "data": { "txs": [ "pQHbCxcNChrJR9B8ChRbhNnlP+bEhQK4aZlcON/1yh5h7xIOCgV1cG9rdBIFMTAwMDAaaQolnVRHdCCvf2oe2NCl5FRUZpHoPCaowmaOCuZo1hTkEInacT0JcxJA2PuzKS3ozEWnuDDEAGWQOG82c4SY61FjCmaQyD0su5bGA2eJu6KGPbGYGeMlADrmVqT7INp6QSRGDR0EFbx7CiiC2snJ256jxXI=", "+grbCxcNCu0JqJpIswqzBQgOEjgKILFtpaAZZXYDn8potZYxq5f7haaNrVenscn+Q+NAJEhFEhQIsN+76Lnm5rgDELHblYWao5m7AxI4CiDPVkDJF7ytA7tOuTnQaR6/BFwQXNZnRhkcGn5XMYZYqBIUCOK2maLw2YqQAxClmL6+neHDswMSOAog7gH50Ql+ZNmRc7a6Bxv7REFhrzVsp5m+euXgZ64IWgESFAj5lq7mpvCGvQIQ4raZovDZipADEi4KIB9U1qC2gr6f47UwbyGU53o7/eF2lO9ei9f2EjHGCsluEgoQ+Zau5qbwhr0CEjgKIJEzMYpkTi7Awi03L2r3m3BXVGvf27Yy85OviCPw1IZZEhQIsduVhZqjmbsDELD13+b7zoyCBhI4CiBvV+jzsgrcVKcA5FFf5VXYqi3h9eV9im99/Cn2CSAgNRIUCLD13+b7zoyCBhD53ZqJ3qDVjAoSOAogktXVHFE7vdfp5oHzpQLsP2bNHCywnyfpKZK5Suvh2BQSFAj53ZqJ3qDVjAoQkP6GytvVub0SEjgKIFkuJHi94erQsdGgtveL+G3S73fZ1nKxa0uALe3xdyDOEhQIkP6GytvVub0SEPy45YHdoODqJBI4CiCar/AoxIucbIBybCNzxMOuXFYMw+bbcqHrcknPtup77RIUCPy45YHdoODqJBCOyN2MwIKsvU0SOQog75wYEAkG9E5MagBheWwXyEe2CgOG8UQ4tofVU0oIVNgSFQiOyN2MwIKsvU0QrP2yqJizkaaYARI6CiBlknL35xE1kATyYRFvJJXm0zcYCH7vef9xCnEBNuNKsRIWCKz9sqiYs5GmmAEQ9rjMsI778vX/ARo4CiCw7w6dM5txAwlNrDr5wCMST7/C578pLJj4tMxlIRkfzhIUCKWYvr6d4cOzAxCw37vouebmuAMSrgSVpCERCkBjZjg4NmRlNTZkNmEzOWE0YjM3NjdjOTRmZjcxMDgwMmMxMTI5YmI3MDkzZTVlNTk5YjU0ZGI0OTM0MmM1YjI1EIengrOqnoAKGO18IkAzNWFmYjhmZDRlMmI3N2Q0ODYxOGY2MGZlZDU5NTU3MjJmMzg1YWZjOTMxZWIxYzczMmRmOTYwZTg2MTg3OTIzKgQwMDIxMo4CCgUwLjAuMRJANDg1NTViZmI3YzI4NWM3OTIxNmIxODU0NzY3ZWZjM2VhMTBlZGU2NWVjNjM1MzcyNjU4NmM0ZmZlNGNhYjA4ORpAZTdlOTEyMDI1NzNiZGQxOTI3YjAwZmNlOWIwYjQ2ZmE3OTQ0YjA2ZTZmZTFiYzk4N2FiYzg2ZTRkMGRkNDdkNiKAATQ3MmM1NWExY2FkMDNmZDExNDk2YTM3MDk4M2E2OWFmOGY5MTc4ZGE2MTMxNjBlYzdhZWQ2MDBlODgyMjMyNWYxOGY4MmU2OWNkYWU0NTdmM2ZmYzkxNWQ4ZDFiNmFkZjFhN2FjOTZhZTMzODJmMWFmMDc5MmUzNzhmZTcwZjBjOoABNGMwMjZlYTE4Nzk5ZGI4MTI1YzZkMjAzZWU0MTYxYjllZjI1NDI3ZDY4OGVjNjY3Mjc2MTk0YTQxNTc2YjU0NTNmYzY1NmFiZjgzZmFhZmMzN2U1YmZiZTI4YmVlYjU0ODFjZWE0NDFkNDQzMTM0ZjkzMDVlODhhMDIyOWY5MDYYARIOCgV1cG9rdBIFMTAwMDAaaQolnVRHdCA1r7j9Tit31IYY9g/tWVVyLzha/JMesccy35YOhhh5IxJAT2NB2pCAwgGkOvYDiJkvCEWKES+OGI6VezibnLe7LMgaSIxqMOZVmVf8LybgzedTRLZqi66XOdwAH3KZyxr/AyiTnMCojuHqlLcB", "0QrbCxcNCsQJqJpIswqKBQjgAxI6CiD469ld8iSGtGAHegI3TQDKIRzrD6kBpyd54C7nt6/VrRIWCM3Vt8KK4I/2swEQ+Nfn7qWeicO0ARI6CiCsyvBAIpg5DTwL7SwMGtYcEyiuMWipH0vmiCtO1BoRaRIWCPjX5+6lnonDtAEQ94PA2Z6/9+20ARI6CiCw18+AldcIGuBPc7eLIuK9Ds7Mj3SaW6cPPwweWqrlvhIWCPeDwNmev/fttAEQ/pKCs9uF1Ya2ARI6CiA7KVFrFD0PF9HNlv0qIEF4yqT5ETUKAmHgzm1IFeiUXhIWCP6SgrPbhdWGtgEQuYrAp4Ki2Lu4ARI6CiAZFuAlyGRUy2mNpq7yo/rRc9/SB4f3LNmcq7K4aDt7RxIWCLmKwKeCoti7uAEQj97p5va8hpe+ARI6CiA/QA6+ZizT3bZZeN8SDFMKWNd0hdKhvy9XRhzbEFpVAxIWCMzgiNSy2Ly4qQEQ5o7h1pi2yPSzARI6CiCF1uCTJRKtgLHX/ip1aneqpXWoyUllmzaWMnk9AgvM8BIWCPXhuuDdjebtjQEQzOCI1LLYvLipARI5CiAINdz7FbvJGu1OqEFMPV4p8eniNHRSRDvhZQwZJWvVrxIVCJL//OiUlYzjYRD14brg3Y3m7Y0BEi4KIEoEOOjqjTyuXLO9aDg18JDIbIDJXt20PP894bNFLU3NEgoQkv/86JSVjONhEjoKIIBgElqEJV4hzBdN7dg2ZeKzOq1ZBUwshdsYIiU7RJr/EhYIj97p5va8hpe+ARCm+O6K87qs6/8BGjoKIM3qTagAP+yz8KIs5LqV/OG3JATeXCGmWMrcIPM4sx52EhYI5o7h1pi2yPSzARDN1bfCiuCP9rMBEq4ElaQhEQpAMGFkN2JhYzYyOGQ3MDRlOGMwZGU3YTk2ZjRhMTNhOTc1YTM5ZDE2NGU2MTI5NjRhZDM3OWU0YmJhOTdjMTE2YhCoyf630rn7HxjtfCJAYzM2NWQ0NmViOTJiYTRjNzA4Mzg4NWU2ZDk5ZmFjMTExZDg3ZDk5NjE2YmViN2NlZGNmODU5NWNmZWYwMmQwYSoEMDAyMTKOAgoFMC4wLjESQDc1MzQ1NmQ0YjJjNTAyY2QyMDMxYzQ1YzBlYjE2NTBiNjhlMTlmNGI5ZTJkNTVkMDllMGYxOTE1ZGY0ZTA0NDQaQGU3ZTkxMjAyNTczYmRkMTkyN2IwMGZjZTliMGI0NmZhNzk0NGIwNmU2ZmUxYmM5ODdhYmM4NmU0ZDBkZDQ3ZDYigAEyZDJkNDdkNDk3NDg5MjIwNzU4ZWQzMjNjODFiNTc3MjNmOTE1MWVmY2YxOTU4MmQxYzg2ZmFhMjJiMzlhY2FlMTBjY2U1NjMxOTY4ZjIzYTYxYWY1ZjFlZTcxODMzZmU1NDI3ZTMzYzE0ZDVmYWYxN2VjMDAzZDI3ZWZkNzUwOTqAAThhOWZmZDdkYTM1YTMwMTE0OTBhY2M5MGVhOWJhOTg2YWY5ZDM4NGU0NmJmZWVmZjkzNGY4MDBiNWM5ZTc3YmY1OTNmYTkyNzRkMDVlYTBhZTI3MzQ3MDNlNTUyYjZiZDk4ZDVmYzA5YWExYTEzNWJlOTE5Nzc0OWNjM2FkMjAyGAESDgoFdXBva3QSBTEwMDAwGmkKJZ1UR3Qgw2XUbrkrpMcIOIXm2Z+sER2H2ZYWvrfO3PhZXP7wLQoSQNIFwqrwlVQrGkdU42745p8DMieTM/kuAEXWzxNias8reRsXSn1MuHvjQkAIJODEvyEBAEwxP1HlzOC3bL6vUAso09OWx8OGmvfWAQ==", "tAvbCxcNCqgKqJpIswruBQjBARI4CiC+vIfgK6BRGGACc0ObXFFTrtzAh7xtI3fcpP6gFYpfQhIUCLj8kuewu9WoGBC++Z6EvoXoqBgSOAogXnER/RXFzyjRpoigS0OY7vCpR4Qu9APRNHQTLWrbPUESFAia2+fPguKjrRgQzcDMk6K1n9oYEjgKIDxtsMM7fjSrQUhgx1yKlnvlUtmnQnqWN9+bbzHy02NuEhQIzcDMk6K1n9oYEJHeyduG7tiPGRI4CiCdWNtdXDobS3hjkG/fyEdh3YZHywxWiPDMoa46fE6+2BIUCJHeyduG7tiPGRC15rOxl7CYhhoSOAogFQwIadi6Xajoxu9tur534fQ66xv87QEwz5tFJH7ViZMSFAi15rOxl7CYhhoQ7cSImqKdo/YbEjgKIDI+d2fb5ccjCWyElESdbmw7T/uARkUyMyI+lmAjS2xLEhQI7cSImqKdo/YbENOb3a++lKDTHhI4CiBRvxNMpMPu85vpCCzAYom/kOveLzgyo9B6mqDd8GusPxIUCNDonqCb1My0ERC4/JLnsLvVqBgSLgoggANK7LUfN+Xj5hVY9sO+qV/UpE7txrBfZMHlRE2F1lISChDQ6J6gm9TMtBESOAogT2/vHwrvkhKBl9FC1wDZsuVYofGeObY14ChwXgC5fW4SFAjTm92vvpSg0x4QsrPzzubrzZg+EjgKIKiJFUnkz4ZM9wAWv1owEK29+PathDKzqmGwFkLwflJLEhQIsrPzzubrzZg+EN7J7IitjYKWehI5CiBgCVoLJ2qdonhHjvNCiCNbPJsDzoFCeNAA3Fnd6SnfHhIVCN7J7IitjYKWehCg2um3653e6fUBEjoKIIr2RQKNKf5Dw2sYqE+Zy7a3r1+2I+yG1gQ99EWM7ObWEhYIoNrpt+ud3un1ARC8nbr2jvr29P8BGjgKIJrt+SkQj1oYe7iCf6tcAGRJbLpdkFsQU43Wh/an8EXCEhQIvvmehL6F6KgYEJrb58+C4qOtGBKuBJWkIREKQGZhZDIwMGUxNDA1MWI0NzdlODdkNjJlZTE2OTdhYmEwN2MzNjY2MDY3NjlhYzVkNmVmNDA1YWU1MDcxNWU0NzkQ4KqA4/jl7EEY7XwiQDIyMWQ3NjQ4NzUzZGQ3MDFkZDc5Y2QxOGM2YzZmNTlkMzIxMmM0N2QxNGYxM2ExZmU3M2FkNGRjYWY1NTg1ODIqBDAwMjEyjgIKBTAuMC4xEkA3NTM0NTZkNGIyYzUwMmNkMjAzMWM0NWMwZWIxNjUwYjY4ZTE5ZjRiOWUyZDU1ZDA5ZTBmMTkxNWRmNGUwNDQ0GkBlN2U5MTIwMjU3M2JkZDE5MjdiMDBmY2U5YjBiNDZmYTc5NDRiMDZlNmZlMWJjOTg3YWJjODZlNGQwZGQ0N2Q2IoABMmQyZDQ3ZDQ5NzQ4OTIyMDc1OGVkMzIzYzgxYjU3NzIzZjkxNTFlZmNmMTk1ODJkMWM4NmZhYTIyYjM5YWNhZTEwY2NlNTYzMTk2OGYyM2E2MWFmNWYxZWU3MTgzM2ZlNTQyN2UzM2MxNGQ1ZmFmMTdlYzAwM2QyN2VmZDc1MDk6gAFlMDAzZGRlZmE3OTBhNThiYTA2MTk5ZjQ1M2Y3MzI5YjA3NWM5MjkyNDUxZWJlZjJiODEzMDc4NmM1MGE1NmFmNDQ5ZjY0MWU3Y2MzOGRmNmQyNmIyN2ViZjkyODRjOTRkNzZjN2JjYmMzMDllOTFjNjU1NjI3ZDZhMDUwMzkwZhgBEg4KBXVwb2t0EgUxMDAwMBppCiWdVEd0ICIddkh1PdcB3XnNGMbG9Z0yEsR9FPE6H+c61NyvVYWCEkCuBUsCsa4usDakr8qHlM8grjtBZKPPHz+wkuaiU2vp05+GOR1Nh6UhLG55L/iGvkRwkVNmBPvxJZwiYKEo2+0JKPmNyt2t3/jjFg==", "/grbCxcNCvIJqJpIswq4BQiKBhI4CiCgVVD0kkoKecCHNUUzihCFeVwpiGdXtikTQtgjV6GzIBIUCI6vueW+0Zb1eBCgq8Gir9KShXkSOAogr7LC2dTCb/dZllFJGx60wC3+wUtaf1X9/aAYw7TXalESFAiWof7KqJO0gHgQg/+clo68t+t4EjgKIIxfaHbpHWnfkaOIoIdxOGfRNUuAhkKbAv5jLboHbv6aEhQIoKvBoq/SkoV5EL75ktnageGkehI4CiBPeqjea1pA+uxhoMSpPyk5e25Qd4fv2a4vLTWyhURkdhIUCIeQ9vfAjJ2odxCWof7KqJO0gHgSOAogKkMmBDq4EimMJhhRi2W+lHmvSOlC6cnTOxnksBVu8RsSFAi++ZLZ2oHhpHoQ+8il0uXciIl8EjkKIH4yo7qKvjI+CyKhoN279GO1C0P1lt95jarw4aEKqFQ2EhUI+8il0uXciIl8ENC9wJntmcXygAESOgog4eZrrG86qVs6g3PYEddPcU9orjPDZCczJooE8xtKw/YSFgjQvcCZ7ZnF8oABEM+Uhdnui6P7iQESOgogfnKHvLyVkzhE08GonQhLr74Bkh8EaN2OIfiw4JJdfD0SFgjPlIXZ7ouj+4kBEJ+L15f0pc2jnQESOAogXuPJfKQQ/tu5rdo+sLjqDWY/Q89v2TzsfYrI2chjAyISFAiR2q2Nv+rmg1AQh5D298CMnah3Ei4KIBWVtEvhJ52uJp4AzCllb7Sa7r0kHLxi28TyzeSNejGTEgoQkdqtjb/q5oNQEjoKIIzY28jjOb1jD97bf/wAuEBoaMmTpL4CypDirVKrDW7qEhYIn4vXl/SlzaOdARC/vvH7vsut9P8BGjgKII5XruyLWup4Uhs1sAEQxE3L7oBsCIhbLW9eW3Lbx0+SEhQIg/+clo68t+t4EI6vueW+0Zb1eBKuBJWkIREKQDVjYzNkZjBiYmU3ZGE0OTE4MzJjOTIzZjMwNjNiODI4Mzk4ODA5NGUzNGQ0NTkwZDllNmY0NDg3YzFlYTUxMDYQjeiPxNjnlAUY7XwiQDBlM2ZlMTBiOWFjZDI0YzJiYzUxNTRhZDBiMWZjOTNhMTBhODc0ZGNlNGJiODk5MDEzMGIxYzc2NWFkYjgwZGMqBDAwMjEyjgIKBTAuMC4xEkA3NTM0NTZkNGIyYzUwMmNkMjAzMWM0NWMwZWIxNjUwYjY4ZTE5ZjRiOWUyZDU1ZDA5ZTBmMTkxNWRmNGUwNDQ0GkBlN2U5MTIwMjU3M2JkZDE5MjdiMDBmY2U5YjBiNDZmYTc5NDRiMDZlNmZlMWJjOTg3YWJjODZlNGQwZGQ0N2Q2IoABMmQyZDQ3ZDQ5NzQ4OTIyMDc1OGVkMzIzYzgxYjU3NzIzZjkxNTFlZmNmMTk1ODJkMWM4NmZhYTIyYjM5YWNhZTEwY2NlNTYzMTk2OGYyM2E2MWFmNWYxZWU3MTgzM2ZlNTQyN2UzM2MxNGQ1ZmFmMTdlYzAwM2QyN2VmZDc1MDk6gAEyMGZlMDRiNzgwNTYwZTY3NWNiZjEwZDg0NTY4M2QwYWY3NjMwOWU5NjUzOGNhMjc2NDNmZDNiYjcxYmRhZTQ1MDYzYWY4NmZhZDVkMDM4ZDgwMGVlOWQ2MjAzMTFhMjFjZGQ1NTIwNzkyMzA4ZTY2MWQyMWY3ZmY5ZTRiMGEwYhgBEg4KBXVwb2t0EgUxMDAwMBppCiWdVEd0IA4/4QuazSTCvFFUrQsfyToQqHTc5LuJkBMLHHZa24DcEkDqsJHTW320+9apcVDPZNdLUyHN7ojYze0gtGBCAIMAnJ37rfNEhTVcGYrW1Ri0FO6ooCyF492XA7IodqTA/IIKKODH0+ryvuThKg==", "qQLbCxcNCp0Bq4P6fApLCkBkZWUyYjY1NTc4MmVmYmExODY4Y2NmZDkyNmU1NDdlZTBmMDFmNTZiMmQ2NDI3ZGViZWVhYjRhNGRlOTRhODdmEgQwMDIxGPV8Ei8KIP1bjm4pdZNt0ZNY2A4JBh16vkbi1Bw7+x3qFHhOxYaJEgsQ+d3OzqyxycT/ARicAyIU0TzBhsC2OmWhsXsMVZWQe3NpjacoARIOCgV1cG9rdBIFMTAwMDAaaQolnVRHdCD/y/HUmnCBEs8QdM1lxX1LZrjfHn+9EIMkMdFi2/PirxJA8FeEd1ZoWr8oAwA82p8eKbNteI2t879tRvr1ZyBi2tbhoGHUrZD0+TrulGnw9HPFAWEX9e+T5CX/7TE9m0ORCyi26f6F/ciwv1A="] }, "evidence": { "evidence": null }, "header": { "app_hash": "5773EBE52784FD8B5A99C92038823CE214220AA595037777B9D95900C2B05D06", "chain_id": "mainnet", "consensus_hash": "79D43A2344837A7EABF1E05BB6D317B1862A89C2EF6AC8D32C04F846348C3CC6", "data_hash": "3AEBEC5FAE8E6A6D57786276A8C76BDEDE4E83082483DB3C98A48ABF8F5BEB11", "evidence_hash": "", "height": "15997", "last_block_id": { "hash": "4B1D808BC9674613C79A7EA88F1EB3CB896E96D0A283AE1C056ED1F112EDF948", "parts": { "hash": "406DDA46DC8D214B759E84A786873F39208817A16D4FC284A6E9E9A4BDA7BC9C", "total": "4" } }, "last_commit_hash": "E5ECBDE02DE28E13BEE132E9C07EC245B01B73869BF752BE3067D596EC94FFA2", "last_results_hash": "95F527A2B9605FAC0BB04751584DF1ACDFE1BEAD06B5DF8D84A263FA04899C6C", "next_validators_hash": "C3D054BB347999C41DE0F59F9F467CF98C4166DE390C0F0D25ADCCBCDE992A4F", "num_txs": "55", "proposer_address": "9927562F874EDA115201CF6AA609973557E1EE1B", "time": "2021-01-15T22:10:06.205334301Z", "total_txs": "1050209", "validators_hash": "88EC6FBE1BA32BC42CC5447331F0E0043F6169D4488F1AB0D22206FDB0170313", "version": { "app": "0", "block": "10" } }, "last_commit": { "block_id": { "hash": "4B1D808BC9674613C79A7EA88F1EB3CB896E96D0A283AE1C056ED1F112EDF948", "parts": { "hash": "406DDA46DC8D214B759E84A786873F39208817A16D4FC284A6E9E9A4BDA7BC9C", "total": "4" } }, "precommits": [ { "block_id": { "hash": "4B1D808BC9674613C79A7EA88F1EB3CB896E96D0A283AE1C056ED1F112EDF948", "parts": { "hash": "406DDA46DC8D214B759E84A786873F39208817A16D4FC284A6E9E9A4BDA7BC9C", "total": "4" } }, "height": "15996", "round": "0", "signature": "eNtM/RWKiYLcLd//U1N4ADjj9/kuNM+3+6QGk85BPIJmxEByTCm6Xz5ItvMAb/g/jy/W8eP/HEbUZreITok1Aw==", "timestamp": "2021-01-15T22:10:06.134011619Z", "type": 2, "validator_address": "FBECAED57B1F336AACF20B26F4D11378919338B0", "validator_index": "974" }, { "block_id": { "hash": "4B1D808BC9674613C79A7EA88F1EB3CB896E96D0A283AE1C056ED1F112EDF948", "parts": { "hash": "406DDA46DC8D214B759E84A786873F39208817A16D4FC284A6E9E9A4BDA7BC9C", "total": "4" } }, "height": "15996", "round": "0", "signature": "kXIzbt+E9oOrv8z6FyjR1iIK67OTuVIc8MPOIAicXfnPQZJXJM92jHM4tbM1kSQMJ/Wv9VgXka74dwcCcm+LBA==", "timestamp": "2021-01-15T22:10:06.653393245Z", "type": 2, "validator_address": "FC3C34CF987731BC3AEF0530BA572D756603C338", "validator_index": "975" }, { "block_id": { "hash": "4B1D808BC9674613C79A7EA88F1EB3CB896E96D0A283AE1C056ED1F112EDF948", "parts": { "hash": "406DDA46DC8D214B759E84A786873F39208817A16D4FC284A6E9E9A4BDA7BC9C", "total": "4" } }, "height": "15996", "round": "0", "signature": "HA0XTDNHF9QgHQywBtqY5DpBOFwS+Y6k2XfFyqdj9NEun9xNaPbdxoUMqoDAgYNGu07WrFDW6Y2GPTcWM9ZTAw==", "timestamp": "2021-01-15T22:10:06.587017809Z", "type": 2, "validator_address": "FD0EB749307EC08B6763BE883EC6CF85447F2347", "validator_index": "976" }, { "block_id": { "hash": "4B1D808BC9674613C79A7EA88F1EB3CB896E96D0A283AE1C056ED1F112EDF948", "parts": { "hash": "406DDA46DC8D214B759E84A786873F39208817A16D4FC284A6E9E9A4BDA7BC9C", "total": "4" } }, "height": "15996", "round": "0", "signature": "VeCl04okTwt1LKUX2mmOow18sYf1nTcb3wOYEUQQ9SuDaEnTrcCp0bZLKv+ZjuAPr7cRnLRNk0A18leIUFA3DQ==", "timestamp": "2021-01-15T22:10:06.539729127Z", "type": 2, "validator_address": "FD77F699B4FD1E2BB396E0FB0EF9F82C2B36821A", "validator_index": "977" }, { "block_id": { "hash": "4B1D808BC9674613C79A7EA88F1EB3CB896E96D0A283AE1C056ED1F112EDF948", "parts": { "hash": "406DDA46DC8D214B759E84A786873F39208817A16D4FC284A6E9E9A4BDA7BC9C", "total": "4" } }, "height": "15996", "round": "0", "signature": "0Y6XOIkTJhpHOq//uHDhe34gVkPhSRMU7dh1OrwFW+fV4TtL7tIUAAbNed6T/760/EXtO894bbOTvu1mrtMZCA==", "timestamp": "2021-01-15T22:10:08.741674005Z", "type": 2, "validator_address": "FDE6AC7DEB198D52588EFB88B931A1D2F7440CE3", "validator_index": "978" }, { "block_id": { "hash": "4B1D808BC9674613C79A7EA88F1EB3CB896E96D0A283AE1C056ED1F112EDF948", "parts": { "hash": "406DDA46DC8D214B759E84A786873F39208817A16D4FC284A6E9E9A4BDA7BC9C", "total": "4" } }, "height": "15996", "round": "0", "signature": "0EQILOHS5ZMADfGvJw33s+7quQDl/OL7kPcD64STVG8tC+hCJKUkS7BYVwosl35vJM8AaixX4h1LRoeFI9X+Bw==", "timestamp": "2021-01-15T22:10:05.833365966Z", "type": 2, "validator_address": "FDEA5F13DF791D893B174F7FB0AD1211E9FEBD65", "validator_index": "979" }, { "block_id": { "hash": "", "parts": { "hash": "", "total": "0" } }, "height": "15996", "round": "0", "signature": "T6kF0kUES0nRQ9rc8hkrs5nlc/NDSn8jgx4pRlm1nLYOj1YiVCqpClGEsmdAsLQ7w4cAeHTqmLbFLsKvJ81MAw==", "timestamp": "2021-01-15T22:11:22.138405573Z", "type": 2, "validator_address": "FF55455DD95EDF26495EBE688256C771E9FF386A", "validator_index": "980" }, { "block_id": { "hash": "4B1D808BC9674613C79A7EA88F1EB3CB896E96D0A283AE1C056ED1F112EDF948", "parts": { "hash": "406DDA46DC8D214B759E84A786873F39208817A16D4FC284A6E9E9A4BDA7BC9C", "total": "4" } }, "height": "15996", "round": "0", "signature": "+N0Uf/mvQqO5CuZzrlQE9NUvPKaq+t2T8ulzDCzI1YTg0uYGWVWPDPqfSFrZH698nyCSxWi2I7Lgk8wrKxPPAg==", "timestamp": "2021-01-15T22:10:06.17188987Z", "type": 2, "validator_address": "FF67438FA8CC7750AE418117839BFB7BB1AE0229", "validator_index": "981" }, { "block_id": { "hash": "4B1D808BC9674613C79A7EA88F1EB3CB896E96D0A283AE1C056ED1F112EDF948", "parts": { "hash": "406DDA46DC8D214B759E84A786873F39208817A16D4FC284A6E9E9A4BDA7BC9C", "total": "4" } }, "height": "15996", "round": "0", "signature": "wayaKkR6XjExbAjcu0D7FLIZJpeyE24gKzRKTvcfDXhqJponeCLcwFY3rbl15vAWRTLS4vccwE40EzgtDgbjDg==", "timestamp": "2021-01-15T22:10:06.070594041Z", "type": 2, "validator_address": "FF76B0A50E39318DA49897BFD1E75A99BE1DA39B", "validator_index": "982" }, { "block_id": { "hash": "4B1D808BC9674613C79A7EA88F1EB3CB896E96D0A283AE1C056ED1F112EDF948", "parts": { "hash": "406DDA46DC8D214B759E84A786873F39208817A16D4FC284A6E9E9A4BDA7BC9C", "total": "4" } }, "height": "15996", "round": "0", "signature": "p87PEIG5UyCgHVbbLM0jAyA5wCriU8fINBTK0Sb02LvKbiOTXF2gfoLyCsL4RHQw4QIuw97CwvxGJNoZ3XbgCA==", "timestamp": "2021-01-15T22:10:06.095791346Z", "type": 2, "validator_address": "FFC252D9606CFE015A6CB63BA70B0AC3C2417202", "validator_index": "983" }, { "block_id": { "hash": "4B1D808BC9674613C79A7EA88F1EB3CB896E96D0A283AE1C056ED1F112EDF948", "parts": { "hash": "406DDA46DC8D214B759E84A786873F39208817A16D4FC284A6E9E9A4BDA7BC9C", "total": "4" } }, "height": "15996", "round": "0", "signature": "GYa0RaUlvp2gMNUlJjxY+OhQ2GErHlSBTEVJYrTGqg7mKFeCSK/Duv5Db0i/Qsp2Rp+/sOSGIDbATj0mkOq9DA==", "timestamp": "2021-01-15T22:10:06.881226994Z", "type": 2, "validator_address": "FFDAF6C87229B49EFCF9585E0744C1A92AEF46AF", "validator_index": "984" } ] } }, "block_id": { "hash": "B60B496B1006EFB642CDBE52F8FA4DD700D25D9531B864E52E81DC3B09607366", "parts": { "hash": "01B087E945A8E28129D6ABFC3CA8E8E8EBFF6BE5B2E98412443BFBC9C2E5960B", "total": "4" } } }';

    const data: any = this.createData(code, block);
    const response = this.getResponseObject(data, code);

    return this.nockRoute(
      V1RPCRoutes.QueryBlock.toString(),
      code,
      response.data
    );
  }

  public static mockGetAccount(code: number = 200): nock.Scope {
    const account =
      '{"address":"28292b477caf794322b84d5a143f7280a117080b","coins":[{"amount":"3539300","denom":"upokt"}],"name":"fee_collector","permissions":["burner","minter","staking"],"public_key":null}';

    const data: any = this.createData(code, account);
    const response = this.getResponseObject(data, code);
    return this.nockRoute(
      V1RPCRoutes.QueryAccount.toString(),
      code,
      response.data
    );
  }

  public static mockGetTx(code: number = 200): nock.Scope {
    const tx =
      '{"hash":"5EAE1505666E810F3F67110C680E9673C4859971C4803016D66CE244D23D8DE4","height":26377,"index":0,"proof":{"data":null,"proof":{"aunts":null,"index":0,"leaf_hash":null,"total":0},"root_hash":""},"stdTx":{"entropy":3430788021382440400,"fee":[{"amount":"10000","denom":"upokt"}],"memo":"","msg":{"evidence_type":1,"expiration_height":0,"from_address":"191a0db66960877f6ad3e5e6a7a5887616925275","header":{"app_public_key":"306bc76aec5b0d9ff5e12c2de91506a3a1df9d254c11dee3d705a85d74385d0c","chain":"0021","session_height":26369},"merkle_root":{"merkleHash":"T+twrD/DviM6fOxUCPJ8qBcYmRvc3rmcQ/ghkhQODz0=","range":{"lower":0,"upper":1.8443696251800121e+19}},"total_proofs":5696},"signature":{"pub_key":"6fb5b51f3d4113494c1495441eab88429125b38aa1741a24e5089440a4425f9f","signature":"ejnbOShu8AG2QWoBKp5G+0BoTd5YdRUcS8NhRJFh9rBidgHoBex2QAeJpkS2WBlUHBEN2c8QxIJs/OwsmV6yCQ=="}},"tx":"qgLbCxcNCp4Bq4P6fApMCkAzMDZiYzc2YWVjNWIwZDlmZjVlMTJjMmRlOTE1MDZhM2ExZGY5ZDI1NGMxMWRlZTNkNzA1YTg1ZDc0Mzg1ZDBjEgQwMDIxGIHOARIvCiBP63CsP8O+Izp87FQI8nyoFxiZG9zeuZxD+CGSFA4PPRILEPbe/83agMv6/wEYwCwiFBkaDbZpYId/atPl5qeliHYWklJ1KAESDgoFdXBva3QSBTEwMDAwGmkKJZ1UR3Qgb7W1Hz1BE0lMFJVEHquIQpEls4qhdBok5QiUQKRCX58SQHo52zkobvABtkFqASqeRvtAaE3eWHUVHEvDYUSRYfawYnYB6AXsdkAHiaZEtlgZVBwRDdnPEMSCbPzsLJlesgkogcupkfTwps4v","tx_result":{"code":0,"codespace":"","data":null,"events":[{"attributes":[{"key":"YWN0aW9u","value":"Y2xhaW0="}],"type":"message"},{"attributes":[{"key":"cmVjaXBpZW50","value":"ZjE4Mjk2NzZkYjU3NzY4MmU5NDRmYzM0OTNkNDUxYjY3ZmYzZTI5Zg=="},{"key":"YW1vdW50","value":"MTAwMDB1cG9rdA=="}],"type":"transfer"},{"attributes":[{"key":"c2VuZGVy","value":"MTkxYTBkYjY2OTYwODc3ZjZhZDNlNWU2YTdhNTg4NzYxNjkyNTI3NQ=="}],"type":"message"},{"attributes":[{"key":"dmFsaWRhdG9y","value":"MTkxYTBkYjY2OTYwODc3ZjZhZDNlNWU2YTdhNTg4NzYxNjkyNTI3NQ=="}],"type":"claim"}],"gasUsed":"0","gasWanted":"0","info":"","log":""}}';

    const data: any = this.createData(code, tx);
    const response = this.getResponseObject(data, code);
    return this.nockRoute(V1RPCRoutes.QueryTX.toString(), code, response.data);
  }

  public static mockGetTxFail(code: number = 200): nock.Scope {
    const tx =
      '{"code":400,"message":"tx (5EAE1505666E810F3F67110C680E9673C4859971C4803016D66CE244D23D8DE3) not found"}';

    const data: any = this.createData(code, tx);
    const response = this.getResponseObject(data, code);
    return this.nockRoute(V1RPCRoutes.QueryTX.toString(), code, response.data);
  }

  public static mockGetHeight(code: number = 200): nock.Scope {
    const height = '{"height": 26378}';

    const data: any = this.createData(code, height);
    const response = this.getResponseObject(data, code);
    return this.nockRoute(
      V1RPCRoutes.QueryHeight.toString(),
      code,
      response.data
    );
  }

  public static mockGetBalance(code: number = 200): nock.Scope {
    const balance = '{"balance": 35369300}';

    const data: any = this.createData(code, balance);
    const response = this.getResponseObject(data, code);
    return this.nockRoute(
      V1RPCRoutes.QueryBalance.toString(),
      code,
      response.data
    );
  }

  public static mockGetNodesWithJailedAndStakingStatus(
    code: number = 200
  ): nock.Scope {
    const nodes =
      '{"result":[{"address":"0005d93c984bd782f62f7b09977d52d2eab448f1","public_key":"7f97a599ea8ba88eeef24ced9233da8b2ac49c14c2293dbc637eef47916f1d91","jailed":false,"status":2,"chains":["0001","0021"],"service_url":"https://mp-pokt-437.n.blockspaces.io:443","tokens":"15374000000","unstaking_time":"0001-01-01T00:00:00Z"},{"address":"000a52a2b942166942bfdc3f15f4a0ca7f976c3d","public_key":"ebc4e8de39f453dbbe55b21ca1456259972ff4e4c82f2c7f5a3420ed3adb1902","jailed":false,"status":2,"chains":["0001","0021"],"service_url":"https://dc35fa02-4d05-4f55-bd90-d67c55a76e44.nodes.ba2s.skillz.io:443","tokens":"15004309815","unstaking_time":"0001-01-01T00:00:00Z"},{"address":"002183c282e48a8c43ef6dc9b7b59d4c6f6d53e9","public_key":"c65c854bb53781296d7fae6f8962ce9d77859ddc05b2680827b93c9dfecef212","jailed":false,"status":2,"chains":["0001","0021"],"service_url":"https://db-pokt-02.n.blockspaces.io:443","tokens":"15369984630","unstaking_time":"0001-01-01T00:00:00Z"}],"total_pages":1425,"page":1}';

    const data: any = this.createData(code, nodes);
    const response = this.getResponseObject(data, code);
    return this.nockRoute(
      V1RPCRoutes.QueryNodes.toString(),
      code,
      response.data
    );
  }

  public static mockGetNodesWithJailedStatus(code: number = 200): nock.Scope {
    const nodes =
      '{"result":[{"address":"0005d93c984bd782f62f7b09977d52d2eab448f1","public_key":"7f97a599ea8ba88eeef24ced9233da8b2ac49c14c2293dbc637eef47916f1d91","jailed":false,"status":2,"chains":["0001","0021"],"service_url":"https://mp-pokt-437.n.blockspaces.io:443","tokens":"15374000000","unstaking_time":"0001-01-01T00:00:00Z"},{"address":"000a52a2b942166942bfdc3f15f4a0ca7f976c3d","public_key":"ebc4e8de39f453dbbe55b21ca1456259972ff4e4c82f2c7f5a3420ed3adb1902","jailed":false,"status":2,"chains":["0001","0021"],"service_url":"https://dc35fa02-4d05-4f55-bd90-d67c55a76e44.nodes.ba2s.skillz.io:443","tokens":"15004309815","unstaking_time":"0001-01-01T00:00:00Z"},{"address":"002183c282e48a8c43ef6dc9b7b59d4c6f6d53e9","public_key":"c65c854bb53781296d7fae6f8962ce9d77859ddc05b2680827b93c9dfecef212","jailed":false,"status":2,"chains":["0001","0021"],"service_url":"https://db-pokt-02.n.blockspaces.io:443","tokens":"15369984630","unstaking_time":"0001-01-01T00:00:00Z"}],"total_pages":1443,"page":1}';

    const data: any = this.createData(code, nodes);
    const response = this.getResponseObject(data, code);
    return this.nockRoute(
      V1RPCRoutes.QueryNodes.toString(),
      code,
      response.data
    );
  }

  public static mockGetNodesWithStakingStatus(code: number = 200): nock.Scope {
    const nodes =
      '{"result":[{"address":"0005d93c984bd782f62f7b09977d52d2eab448f1","public_key":"7f97a599ea8ba88eeef24ced9233da8b2ac49c14c2293dbc637eef47916f1d91","jailed":false,"status":2,"chains":["0001","0021"],"service_url":"https://mp-pokt-437.n.blockspaces.io:443","tokens":"15374000000","unstaking_time":"0001-01-01T00:00:00Z"},{"address":"000a52a2b942166942bfdc3f15f4a0ca7f976c3d","public_key":"ebc4e8de39f453dbbe55b21ca1456259972ff4e4c82f2c7f5a3420ed3adb1902","jailed":false,"status":2,"chains":["0001","0021"],"service_url":"https://dc35fa02-4d05-4f55-bd90-d67c55a76e44.nodes.ba2s.skillz.io:443","tokens":"15004309815","unstaking_time":"0001-01-01T00:00:00Z"},{"address":"002183c282e48a8c43ef6dc9b7b59d4c6f6d53e9","public_key":"c65c854bb53781296d7fae6f8962ce9d77859ddc05b2680827b93c9dfecef212","jailed":false,"status":2,"chains":["0001","0021"],"service_url":"https://db-pokt-02.n.blockspaces.io:443","tokens":"15369984630","unstaking_time":"0001-01-01T00:00:00Z"}],"total_pages":1528,"page":1}';

    const data: any = this.createData(code, nodes);
    const response = this.getResponseObject(data, code);
    return this.nockRoute(
      V1RPCRoutes.QueryNodes.toString(),
      code,
      response.data
    );
  }

  public static mockGetNodesWithoutJailedAndStakingStatus(
    code: number = 200
  ): nock.Scope {
    const nodes =
      '{"result":[{"address":"0005d93c984bd782f62f7b09977d52d2eab448f1","public_key":"7f97a599ea8ba88eeef24ced9233da8b2ac49c14c2293dbc637eef47916f1d91","jailed":false,"status":2,"chains":["0001","0021"],"service_url":"https://mp-pokt-437.n.blockspaces.io:443","tokens":"15374000000","unstaking_time":"0001-01-01T00:00:00Z"},{"address":"000a52a2b942166942bfdc3f15f4a0ca7f976c3d","public_key":"ebc4e8de39f453dbbe55b21ca1456259972ff4e4c82f2c7f5a3420ed3adb1902","jailed":false,"status":2,"chains":["0001","0021"],"service_url":"https://dc35fa02-4d05-4f55-bd90-d67c55a76e44.nodes.ba2s.skillz.io:443","tokens":"15004309815","unstaking_time":"0001-01-01T00:00:00Z"},{"address":"002183c282e48a8c43ef6dc9b7b59d4c6f6d53e9","public_key":"c65c854bb53781296d7fae6f8962ce9d77859ddc05b2680827b93c9dfecef212","jailed":false,"status":2,"chains":["0001","0021"],"service_url":"https://db-pokt-02.n.blockspaces.io:443","tokens":"15369984630","unstaking_time":"0001-01-01T00:00:00Z"}],"total_pages":1547,"page":1}';

    const data: any = this.createData(code, nodes);
    const response = this.getResponseObject(data, code);
    return this.nockRoute(
      V1RPCRoutes.QueryNodes.toString(),
      code,
      response.data
    );
  }

  public static mockGetNode(code: number = 200): nock.Scope {
    const node =
      '{"address":"7625d93c984bd782f62f7b00011dddd2eab448f1","chains":["0001","0021"],"jailed":false,"public_key":"8f97b455ea8ba11eeef21ced9234da8b2ac49c13c2293dbc637eef47916f1d91","service_url":"https://stakingislife.io:443","status":2,"tokens":"15374000000","unstaking_time":"0001-01-01T00:00:00Z"}';

    const data: any = this.createData(code, node);
    const response = this.getResponseObject(data, code);
    return this.nockRoute(
      V1RPCRoutes.QueryNode.toString(),
      code,
      response.data
    );
  }

  public static mockGetNodeParams(code: number = 200): nock.Scope {
    const nodeparams =
      '{"dao_allocation":"10","downtime_jail_duration":"3600000000000","max_evidence_age":"120000000000","max_jailed_blocks":"37960","max_validators":"5000","maximum_chains":"15","min_signed_per_window":"6.000000000000000000","proposer_allocation":"1","relays_to_tokens_multiplier":"0","session_block_frequency":"4","signed_blocks_window":"10","slash_fraction_double_sign":"0.000001000000000000","slash_fraction_downtime":"0.000001000000000000","stake_denom":"upokt","stake_minimum":"15000000000","unstaking_time":"1814000000000000"}';

    const data: any = this.createData(code, nodeparams);
    const response = this.getResponseObject(data, code);
    return this.nockRoute(
      V1RPCRoutes.QueryNodeParams.toString(),
      code,
      response.data
    );
  }

  public static mockGetApps(code: number = 200): nock.Scope {
    const apps =
      '{"result":[{"address":"82726b59a0ad7099f77dc2220c0ed2a0df314777","public_key":"caa065039d766d950f4950c4199491315eff0129b252ff9cd0002c6de716d622","jailed":false,"chains":["0022"],"max_relays":"41666","status":2,"staked_tokens":"24950100000","unstaking_time":"0001-01-01T00:00:00Z"},{"address":"65426b59a0ad7099f77dc2220c0ed2a0df314444","public_key":"daa065039d766d950f4950c4199491315eff0129b252ff9cd0002c6de716c622","jailed":false,"chains":["0001","0021","0022","0023","0024","0025","0026","0027"],"max_relays":"41750","status":2,"staked_tokens":"25000000000","unstaking_time":"0001-01-01T00:00:00Z"}],"total_pages":16,"page":1}';
    const data: any = this.createData(code, apps);

    const response = this.getResponseObject(data, code);
    return this.nockRoute(
      V1RPCRoutes.QueryApps.toString(),
      code,
      response.data
    );
  }

  public static mockGetAppsWithoutStakingStatus(
    code: number = 200
  ): nock.Scope {
    const apps =
      '{"result":[{"address":"05744b59a0ad7099f77dcf050c0ed2a0df3142b9","public_key":"cee065039d788d950f4950c4199491315eff0129b252ff9cd0113c7de716d752","jailed":false,"chains":["0022"],"max_relays":"41666","status":2,"staked_tokens":"24950100000","unstaking_time":"0001-01-01T00:00:00Z"},{"address":"0b145bf8511db15f221a6a4b2aa58b0dc0e49c36","public_key":"e7b5b619b1240eb414983ec485d32e30418dbf18c7cd7c662c8ac150f7651c6b","jailed":false,"chains":["0001","0021","0022","0023","0024","0025","0026","0027"],"max_relays":"41750","status":2,"staked_tokens":"25000000000","unstaking_time":"0001-01-01T00:00:00Z"},{"address":"141da7e491fde2096ac4df26ae32bb5ca2cc0236","public_key":"98e4bb647e482d55e9d1f45d0ad23e741b9484e604f040810ea9330137d3d030","jailed":false,"chains":["0001","0002","0003","0011","0021","0022","0023","0024","0025","0026","0027"],"max_relays":"41750","status":2,"staked_tokens":"25000000000","unstaking_time":"0001-01-01T00:00:00Z"}],"total_pages":17,"page":1}';
    const data: any = this.createData(code, apps);

    const response = this.getResponseObject(data, code);
    return this.nockRoute(
      V1RPCRoutes.QueryApps.toString(),
      code,
      response.data
    );
  }

  public static mockGetApp(code: number = 200): nock.Scope {
    const app =
      '{"address":"05744b59a0ad7099f77dcf050c0ed2a0df3142b9","chains":["0022"],"jailed":false,"max_relays":"41666","public_key":"cee065039d788d950f4950c4199491315eff0129b252ff9cd0113c7de716d752","staked_tokens":"24950100000","status":2,"unstaking_time":"0001-01-01T00:00:00Z"}';

    const data: any = this.createData(code, app);
    const response = this.getResponseObject(data, code);

    return this.nockRoute(V1RPCRoutes.QueryApp.toString(), code, response.data);
  }
  // TODO: Continue with the rest of queries
  public static mockGetAppParams(code: number = 200): nock.Scope {
    const appParams =
      '{"app_stake_minimum":"1000000","base_relays_per_pokt":"167","max_applications":"9223372036854775807","maximum_chains":"15","participation_rate_on":false,"stability_adjustment":"0","unstaking_time":"1814000000000000"}';

    const data: any = this.createData(code, appParams);
    const response = this.getResponseObject(data, code);

    return this.nockRoute(
      V1RPCRoutes.QueryAppParams.toString(),
      code,
      response.data
    );
  }

  public static mockGetPocketParams(code: number = 200): nock.Scope {
    const pocketParams = `{"claim_expiration":"24","minimum_number_of_proofs":"10","proof_waiting_period":"3","replay_attack_burn_multiplier":"3","session_node_count":"5","supported_blockchains":["0001","0021"]}`;
    const data: any = this.createData(code, pocketParams);

    const response = this.getResponseObject(data, code);
    return this.nockRoute(
      V1RPCRoutes.QueryPocketParams.toString(),
      code,
      response.data
    );
  }

  public static mockGetSupportedChains(code: number = 200): nock.Scope {
    const supportedChains = `["0001","0021"]`;
    const data: any = this.createData(code, supportedChains);

    const response = this.getResponseObject(data, code);
    return this.nockRoute(
      V1RPCRoutes.QuerySupportedChains.toString(),
      code,
      response.data
    );
  }

  public static mockGetSupply(code: number = 200): nock.Scope {
    const supply = `{"app_staked":"8247320959583","dao":"50838913610173","node_staked":"205720349413340","total":"661133373869116","total_staked":"264806583983096","total_unstaked":"396326789886020"}`;
    const data: any = this.createData(code, supply);

    const response = this.getResponseObject(data, code);
    return this.nockRoute(
      V1RPCRoutes.QuerySupply.toString(),
      code,
      response.data
    );
  }

  public static mockChallenge(code: number = 200): nock.Scope {
    const challengeResponse = new ChallengeResponse(addressHex);

    const data: any = this.createData(code, challengeResponse.toJSON());

    const response = this.getResponseObject(data, code);
    return this.nockRoute(
      V1RPCRoutes.ClientChallenge.toString(),
      code,
      response.data
    );
  }

  public static mockAccountTxs(code: number = 200): nock.Scope {
    const accountTxs = `{"total_count":2,"txs":[{"hash":"127F7DAD339F212009B2C0130F5A4D7594C7351176AD72B10C144C0DFDE9906D","height":25991,"index":62,"proof":{"data":null,"proof":{"aunts":null,"index":0,"leaf_hash":null,"total":0},"root_hash":""},"stdTx":{"entropy":14532251131582008,"fee":[{"amount":"10000","denom":"upokt"}],"memo":"Pocket Wallet","msg":{"amount":"1000000","from_address":"3f283a97f1f62053be75f63e882bde9aee65add0","to_address":"fc4ce431585352af219baf26f925db6cdd3a2a80"},"signature":{"pub_key":"17c7a55bb2cec35559b4c07332339e0141591dc0267718bc41c704adb1d06ca6","signature":"SdYDtMCi7SLaMQE+lJ72+RiSnEqan3rRYF547HZXFgYURo21wmEQIZJkd0aO4tLpYuh9PmYjryznp1hoE6dpDA=="}},"tx":"0gHbCxcNCjml40SmChQ\/KDqX8fYgU7519j6IK96a7mWt0BIU\/EzkMVhTUq8hm68m+SXbbN06KoAaBzEwMDAwMDASDgoFdXBva3QSBTEwMDAwGmkKJZ1UR3QgF8elW7LOw1VZtMBzMjOeAUFZHcAmdxi8QccErbHQbKYSQEnWA7TAou0i2jEBPpSe9vkYkpxKmp960WBeeOx2VxYGFEaNtcJhECGSZHdGjuLS6WLofT5mI68s56dYaBOnaQwiDVBvY2tldCBXYWxsZXQouKzwk5ag6Bk=","tx_result":{"code":0,"codespace":"","data":null,"events":[{"attributes":[{"key":"YWN0aW9u","value":"c2VuZA=="}],"type":"message"},{"attributes":[{"key":"cmVjaXBpZW50","value":"ZmM0Y2U0MzE1ODUzNTJhZjIxOWJhZjI2ZjkyNWRiNmNkZDNhMmE4MA=="},{"key":"YW1vdW50","value":"MTAwMDAwMHVwb2t0"}],"type":"transfer"},{"attributes":[{"key":"c2VuZGVy","value":"M2YyODNhOTdmMWY2MjA1M2JlNzVmNjNlODgyYmRlOWFlZTY1YWRkMA=="}],"type":"message"},{"attributes":[{"key":"bW9kdWxl","value":"cG9z"}],"type":"message"}],"gasUsed":"0","gasWanted":"0","info":"","log":""}},{"hash":"DAD82DBAD609CE3B418601FEEF71F1458BEFCB1A3DCF70B167BE9391C787395C","height":25991,"index":63,"proof":{"data":null,"proof":{"aunts":null,"index":0,"leaf_hash":null,"total":0},"root_hash":""},"stdTx":{"entropy":-7473568640314529000,"fee":[{"amount":"10000","denom":"upokt"}],"memo":"","msg":{"evidence_type":1,"leaf":{"aat":{"app_pub_key":"2099e51e72ece8458b09680899a747e114343b66bec00f272d090da96aaeb436","client_pub_key":"e7e91202573bdd1927b00fce9b0b46fa7944b06e6fe1bc987abc86e4d0dd47d6","signature":"6172942ce26f3f11ead505b36dba7c56ca0cb08403b0214b337a3fc09fba74341b6600312e58825e48f2d20930966eeaa7a9c732f2d5bd17ca8e58279d63040c","version":"0.0.1"},"blockchain":"0021","entropy":21762888261789870,"request_hash":"0b5bc426e8c85453ced8cff91350b62f4efc7b2532f436a641868555d227404d","servicer_pub_key":"5ab31edeb79df6d87a53420525fad6956c297a584e5ef0bb2e561dc16bf28d29","session_block_height":25977,"signature":"04905e4a67a817cbc8163f2620c2792510e4e1b7119338dd409a32afe27a61e252074af580fada1e3fd5713044797e7cc7e80e7f735aef553e671ced93f25205"},"merkle_proofs":{"hash_ranges":[{"merkleHash":"P50\/UmytAhI1GRrcweMj5Mf1jEdLw8LI+I+SWXs1ATE=","range":{"lower":1162204141445591300,"upper":1297790323384098000}},{"merkleHash":"QYRXqnziV+ZxmirVUATCCNtnS9m4x4a97mdQxqXXdu4=","range":{"lower":1297790323384098000,"upper":1765695886531194400}},{"merkleHash":"jxFdj77UYyRXUNVDFLF+tCV6XdETVPtDJNrQoY62asU=","range":{"lower":0,"upper":1012590572837164000}},{"merkleHash":"YwqfyM\/fkJhQwMvgpkEvZzW+1Kkhbfr3leh7VYHANbQ=","range":{"lower":1765695886531194400,"upper":3303841385010176000}},{"merkleHash":"bTUx38OrMvREpAUFseOi1LCjTk0SPrxP3gJwEcvr\/5U=","range":{"lower":3303841385010176000,"upper":9.994661900910553e+18}},{"merkleHash":"HVD7\/mgvrIIbvdlphUr1+vpv7qjqUBpl8QoS1j481AM=","range":{"lower":9.994661900910553e+18,"upper":1.8151845893226576e+19}}],"index":4,"target_range":{"merkleHash":"GTFaT4L6IBCq++l7YeNniQxtk4y4eeBvGjEp9W7\/9GE=","range":{"lower":1012590572837164000,"upper":1162204141445591300}}}},"signature":{"pub_key":"5ab31edeb79df6d87a53420525fad6956c297a584e5ef0bb2e561dc16bf28d29","signature":"MCkOt1b5zhTz+QVSyqoH3eZ\/sKDoNxeILilJmTyK0LOOV1SWgb866C\/HQl+Jwq9e3PKKndLRN66ScTrpD107Dw=="}},"tx":"2QjbCxcNCswHqJpIswqRAwgEEjgKID+dP1JsrQISNRka3MHjI+TH9YxHS8PCyPiPkll7NQExEhQImeLo+qTQvpAQEL+6\/pHFrauBEhI4CiBBhFeqfOJX5nGaKtVQBMII22dL2bjHhr3uZ1DGpdd27hIUCL+6\/pHFrauBEhDU272Q3OHAwBgSLgogjxFdj77UYyRXUNVDFLF+tCV6XdETVPtDJNrQoY62asUSChC2qPmmrbjchg4SOAogYwqfyM\/fkJhQwMvgpkEvZzW+1Kkhbfr3leh7VYHANbQSFAjU272Q3OHAwBgQ97+QnsPH5uwtEjkKIG01Md\/DqzL0RKQFBbHjotSwo05NEj68T94CcBHL6\/+VEhUI97+QnsPH5uwtELrOne+3gYvaigESOgogHVD7\/mgvrIIbvdlphUr1+vpv7qjqUBpl8QoS1j481AMSFgi6zp3vt4GL2ooBEOH2nJut9ZP0+wEaOAogGTFaT4L6IBCq++l7YeNniQxtk4y4eeBvGjEp9W7\/9GESFAi2qPmmrbjchg4QmeLo+qTQvpAQEq8ElaQhEQpAMGI1YmM0MjZlOGM4NTQ1M2NlZDhjZmY5MTM1MGI2MmY0ZWZjN2IyNTMyZjQzNmE2NDE4Njg1NTVkMjI3NDA0ZBCu0YXBtKfUJhj5ygEiQDVhYjMxZWRlYjc5ZGY2ZDg3YTUzNDIwNTI1ZmFkNjk1NmMyOTdhNTg0ZTVlZjBiYjJlNTYxZGMxNmJmMjhkMjkqBDAwMjEyjgIKBTAuMC4xEkAyMDk5ZTUxZTcyZWNlODQ1OGIwOTY4MDg5OWE3NDdlMTE0MzQzYjY2YmVjMDBmMjcyZDA5MGRhOTZhYWViNDM2GkBlN2U5MTIwMjU3M2JkZDE5MjdiMDBmY2U5YjBiNDZmYTc5NDRiMDZlNmZlMWJjOTg3YWJjODZlNGQwZGQ0N2Q2IoABNjE3Mjk0MmNlMjZmM2YxMWVhZDUwNWIzNmRiYTdjNTZjYTBjYjA4NDAzYjAyMTRiMzM3YTNmYzA5ZmJhNzQzNDFiNjYwMDMxMmU1ODgyNWU0OGYyZDIwOTMwOTY2ZWVhYTdhOWM3MzJmMmQ1YmQxN2NhOGU1ODI3OWQ2MzA0MGM6gAEwNDkwNWU0YTY3YTgxN2NiYzgxNjNmMjYyMGMyNzkyNTEwZTRlMWI3MTE5MzM4ZGQ0MDlhMzJhZmUyN2E2MWUyNTIwNzRhZjU4MGZhZGExZTNmZDU3MTMwNDQ3OTdlN2NjN2U4MGU3ZjczNWFlZjU1M2U2NzFjZWQ5M2YyNTIwNRgBEg4KBXVwb2t0EgUxMDAwMBppCiWdVEd0IFqzHt63nfbYelNCBSX61pVsKXpYTl7wuy5WHcFr8o0pEkAwKQ63VvnOFPP5BVLKqgfd5n+woOg3F4guKUmZPIrQs45XVJaBvzroL8dCX4nCr17c8oqd0tE3rpJxOukPXTsPKPXZtqyxnaOkmAE=","tx_result":{"code":0,"codespace":"","data":null,"events":[{"attributes":[{"key":"YWN0aW9u","value":"cHJvb2Y="}],"type":"message"},{"attributes":[{"key":"YW1vdW50","value":"MTAwMDB1cG9rdA=="}],"type":"transfer"},{"attributes":[{"key":"c2VuZGVy","value":"M2YyODNhOTdmMWY2MjA1M2JlNzVmNjNlODgyYmRlOWFlZTY1YWRkMA=="}],"type":"message"},{"attributes":[{"key":"cmVjaXBpZW50","value":"ZjE4Mjk2NzZkYjU3NzY4MmU5NDRmYzM0OTNkNDUxYjY3ZmYzZTI5Zg=="},{"key":"YW1vdW50","value":"MTAwMDB1cG9rdA=="}],"type":"transfer"},{"attributes":[{"key":"c2VuZGVy","value":"M2Y1NTMxNGViNzQyY2MzZjc2ZGViOWI1Zjk3NTNlY2YzM2IwNjhhYw=="}],"type":"message"},{"attributes":[{"key":"cmVjaXBpZW50","value":"M2Y1NTMxNGViNzQyY2MzZjc2ZGViOWI1Zjk3NTNlY2YzM2IwNjhhYw=="},{"key":"YW1vdW50","value":"NTUxODAwdXBva3Q="}],"type":"transfer"},{"attributes":[{"key":"c2VuZGVy","value":"OGVmOTdiNDg4ZTY2YTJiMmU4OWEzYjQ5OTk1NDk4MTY3Njg5MTBmYg=="}],"type":"message"},{"attributes":[{"key":"cmVjaXBpZW50","value":"ZjE4Mjk2NzZkYjU3NzY4MmU5NDRmYzM0OTNkNDUxYjY3ZmYzZTI5Zg=="},{"key":"YW1vdW50","value":"NjgyMDB1cG9rdA=="}],"type":"transfer"},{"attributes":[{"key":"c2VuZGVy","value":"OGVmOTdiNDg4ZTY2YTJiMmU4OWEzYjQ5OTk1NDk4MTY3Njg5MTBmYg=="}],"type":"message"},{"attributes":[{"key":"dmFsaWRhdG9y","value":"M2Y1NTMxNGViNzQyY2MzZjc2ZGViOWI1Zjk3NTNlY2YzM2IwNjhhYw=="}],"type":"proof"}],"gasUsed":"0","gasWanted":"0","info":"","log":""}}]}`;
    const data: any = this.createData(code, accountTxs);

    const response = this.getResponseObject(data, code);
    return this.nockRoute(
      V1RPCRoutes.QueryAccountTxs.toString(),
      code,
      response.data
    );
  }

  public static mockAccountTxsWithProve(code: number = 200): nock.Scope {
    const accountTxs =
      '{"total_count":2,"txs":[{"hash":"127F7DAD339F212009B2C0130F5A4D7594C7351176AD72B10C144C0DFDE9906D","height":25991,"index":62,"proof":{"data":"0gHbCxcNCjml40SmChQ/KDqX8fYgU7519j6IK96a7mWt0BIU/EzkMVhTUq8hm68m+SXbbN06KoAaBzEwMDAwMDASDgoFdXBva3QSBTEwMDAwGmkKJZ1UR3QgF8elW7LOw1VZtMBzMjOeAUFZHcAmdxi8QccErbHQbKYSQEnWA7TAou0i2jEBPpSe9vkYkpxKmp960WBeeOx2VxYGFEaNtcJhECGSZHdGjuLS6WLofT5mI68s56dYaBOnaQwiDVBvY2tldCBXYWxsZXQouKzwk5ag6Bk=","proof":{"aunts":["27zuDDQKLhjxoqrBcwSVWv7Gc6DlrThtmWeAFW6dgZY=","8jsMpSdaZU1+fg3uajJqy3nx2d2if34Bi6PzXshjn1U=","VOTwAlUxaAAPeW5bXz8N3C0H/PmNX+F9+CmPV7DKLqs=","8JPOApgMBuRFvsdqd9jvNGznArdwnY5fpIeCAfZSZVU=","227hUgllmP/tNVQhWMGDEckpgqkDGjuBVPOgH2sl5lE=","9rdwPZjpq5gSo03jC7uwxf2YWehLDJDkYaiw0HBvAR4=","iuaXb8rst3Mr7FUdcLw53WE3j4874yT9uWGJKfpSLsM="],"index":62,"leaf_hash":"Z99q4S8DWaRmPMtpI/bknjI+hUlOgkhTEMf5Iw8UnV0=","total":66},"root_hash":"24EFB11B0201888EFE77BC1DE5B65D4707E5605586AEC6AC68FEAFF200734B78"},"stdTx":{"entropy":14532251131582008,"fee":[{"amount":"10000","denom":"upokt"}],"memo":"Pocket Wallet","msg":{"amount":"1000000","from_address":"3f283a97f1f62053be75f63e882bde9aee65add0","to_address":"fc4ce431585352af219baf26f925db6cdd3a2a80"},"signature":{"pub_key":"17c7a55bb2cec35559b4c07332339e0141591dc0267718bc41c704adb1d06ca6","signature":"SdYDtMCi7SLaMQE+lJ72+RiSnEqan3rRYF547HZXFgYURo21wmEQIZJkd0aO4tLpYuh9PmYjryznp1hoE6dpDA=="}},"tx":"0gHbCxcNCjml40SmChQ/KDqX8fYgU7519j6IK96a7mWt0BIU/EzkMVhTUq8hm68m+SXbbN06KoAaBzEwMDAwMDASDgoFdXBva3QSBTEwMDAwGmkKJZ1UR3QgF8elW7LOw1VZtMBzMjOeAUFZHcAmdxi8QccErbHQbKYSQEnWA7TAou0i2jEBPpSe9vkYkpxKmp960WBeeOx2VxYGFEaNtcJhECGSZHdGjuLS6WLofT5mI68s56dYaBOnaQwiDVBvY2tldCBXYWxsZXQouKzwk5ag6Bk=","tx_result":{"code":0,"codespace":"","data":null,"events":[{"attributes":[{"key":"YWN0aW9u","value":"c2VuZA=="}],"type":"message"},{"attributes":[{"key":"cmVjaXBpZW50","value":"ZmM0Y2U0MzE1ODUzNTJhZjIxOWJhZjI2ZjkyNWRiNmNkZDNhMmE4MA=="},{"key":"YW1vdW50","value":"MTAwMDAwMHVwb2t0"}],"type":"transfer"},{"attributes":[{"key":"c2VuZGVy","value":"M2YyODNhOTdmMWY2MjA1M2JlNzVmNjNlODgyYmRlOWFlZTY1YWRkMA=="}],"type":"message"},{"attributes":[{"key":"bW9kdWxl","value":"cG9z"}],"type":"message"}],"gasUsed":"0","gasWanted":"0","info":"","log":""}},{"hash":"DAD82DBAD609CE3B418601FEEF71F1458BEFCB1A3DCF70B167BE9391C787395C","height":25991,"index":63,"proof":{"data":"2QjbCxcNCswHqJpIswqRAwgEEjgKID+dP1JsrQISNRka3MHjI+TH9YxHS8PCyPiPkll7NQExEhQImeLo+qTQvpAQEL+6/pHFrauBEhI4CiBBhFeqfOJX5nGaKtVQBMII22dL2bjHhr3uZ1DGpdd27hIUCL+6/pHFrauBEhDU272Q3OHAwBgSLgogjxFdj77UYyRXUNVDFLF+tCV6XdETVPtDJNrQoY62asUSChC2qPmmrbjchg4SOAogYwqfyM/fkJhQwMvgpkEvZzW+1Kkhbfr3leh7VYHANbQSFAjU272Q3OHAwBgQ97+QnsPH5uwtEjkKIG01Md/DqzL0RKQFBbHjotSwo05NEj68T94CcBHL6/+VEhUI97+QnsPH5uwtELrOne+3gYvaigESOgogHVD7/mgvrIIbvdlphUr1+vpv7qjqUBpl8QoS1j481AMSFgi6zp3vt4GL2ooBEOH2nJut9ZP0+wEaOAogGTFaT4L6IBCq++l7YeNniQxtk4y4eeBvGjEp9W7/9GESFAi2qPmmrbjchg4QmeLo+qTQvpAQEq8ElaQhEQpAMGI1YmM0MjZlOGM4NTQ1M2NlZDhjZmY5MTM1MGI2MmY0ZWZjN2IyNTMyZjQzNmE2NDE4Njg1NTVkMjI3NDA0ZBCu0YXBtKfUJhj5ygEiQDVhYjMxZWRlYjc5ZGY2ZDg3YTUzNDIwNTI1ZmFkNjk1NmMyOTdhNTg0ZTVlZjBiYjJlNTYxZGMxNmJmMjhkMjkqBDAwMjEyjgIKBTAuMC4xEkAyMDk5ZTUxZTcyZWNlODQ1OGIwOTY4MDg5OWE3NDdlMTE0MzQzYjY2YmVjMDBmMjcyZDA5MGRhOTZhYWViNDM2GkBlN2U5MTIwMjU3M2JkZDE5MjdiMDBmY2U5YjBiNDZmYTc5NDRiMDZlNmZlMWJjOTg3YWJjODZlNGQwZGQ0N2Q2IoABNjE3Mjk0MmNlMjZmM2YxMWVhZDUwNWIzNmRiYTdjNTZjYTBjYjA4NDAzYjAyMTRiMzM3YTNmYzA5ZmJhNzQzNDFiNjYwMDMxMmU1ODgyNWU0OGYyZDIwOTMwOTY2ZWVhYTdhOWM3MzJmMmQ1YmQxN2NhOGU1ODI3OWQ2MzA0MGM6gAEwNDkwNWU0YTY3YTgxN2NiYzgxNjNmMjYyMGMyNzkyNTEwZTRlMWI3MTE5MzM4ZGQ0MDlhMzJhZmUyN2E2MWUyNTIwNzRhZjU4MGZhZGExZTNmZDU3MTMwNDQ3OTdlN2NjN2U4MGU3ZjczNWFlZjU1M2U2NzFjZWQ5M2YyNTIwNRgBEg4KBXVwb2t0EgUxMDAwMBppCiWdVEd0IFqzHt63nfbYelNCBSX61pVsKXpYTl7wuy5WHcFr8o0pEkAwKQ63VvnOFPP5BVLKqgfd5n+woOg3F4guKUmZPIrQs45XVJaBvzroL8dCX4nCr17c8oqd0tE3rpJxOukPXTsPKPXZtqyxnaOkmAE=","proof":{"aunts":["Z99q4S8DWaRmPMtpI/bknjI+hUlOgkhTEMf5Iw8UnV0=","8jsMpSdaZU1+fg3uajJqy3nx2d2if34Bi6PzXshjn1U=","VOTwAlUxaAAPeW5bXz8N3C0H/PmNX+F9+CmPV7DKLqs=","8JPOApgMBuRFvsdqd9jvNGznArdwnY5fpIeCAfZSZVU=","227hUgllmP/tNVQhWMGDEckpgqkDGjuBVPOgH2sl5lE=","9rdwPZjpq5gSo03jC7uwxf2YWehLDJDkYaiw0HBvAR4=","iuaXb8rst3Mr7FUdcLw53WE3j4874yT9uWGJKfpSLsM="],"index":63,"leaf_hash":"27zuDDQKLhjxoqrBcwSVWv7Gc6DlrThtmWeAFW6dgZY=","total":66},"root_hash":"24EFB11B0201888EFE77BC1DE5B65D4707E5605586AEC6AC68FEAFF200734B78"},"stdTx":{"entropy":-7473568640314529000,"fee":[{"amount":"10000","denom":"upokt"}],"memo":"","msg":{"evidence_type":1,"leaf":{"aat":{"app_pub_key":"2099e51e72ece8458b09680899a747e114343b66bec00f272d090da96aaeb436","client_pub_key":"e7e91202573bdd1927b00fce9b0b46fa7944b06e6fe1bc987abc86e4d0dd47d6","signature":"6172942ce26f3f11ead505b36dba7c56ca0cb08403b0214b337a3fc09fba74341b6600312e58825e48f2d20930966eeaa7a9c732f2d5bd17ca8e58279d63040c","version":"0.0.1"},"blockchain":"0021","entropy":21762888261789870,"request_hash":"0b5bc426e8c85453ced8cff91350b62f4efc7b2532f436a641868555d227404d","servicer_pub_key":"5ab31edeb79df6d87a53420525fad6956c297a584e5ef0bb2e561dc16bf28d29","session_block_height":25977,"signature":"04905e4a67a817cbc8163f2620c2792510e4e1b7119338dd409a32afe27a61e252074af580fada1e3fd5713044797e7cc7e80e7f735aef553e671ced93f25205"},"merkle_proofs":{"hash_ranges":[{"merkleHash":"P50/UmytAhI1GRrcweMj5Mf1jEdLw8LI+I+SWXs1ATE=","range":{"lower":1162204141445591300,"upper":1297790323384098000}},{"merkleHash":"QYRXqnziV+ZxmirVUATCCNtnS9m4x4a97mdQxqXXdu4=","range":{"lower":1297790323384098000,"upper":1765695886531194400}},{"merkleHash":"jxFdj77UYyRXUNVDFLF+tCV6XdETVPtDJNrQoY62asU=","range":{"lower":0,"upper":1012590572837164000}},{"merkleHash":"YwqfyM/fkJhQwMvgpkEvZzW+1Kkhbfr3leh7VYHANbQ=","range":{"lower":1765695886531194400,"upper":3303841385010176000}},{"merkleHash":"bTUx38OrMvREpAUFseOi1LCjTk0SPrxP3gJwEcvr/5U=","range":{"lower":3303841385010176000,"upper":9.994661900910553e+18}},{"merkleHash":"HVD7/mgvrIIbvdlphUr1+vpv7qjqUBpl8QoS1j481AM=","range":{"lower":9.994661900910553e+18,"upper":1.8151845893226576e+19}}],"index":4,"target_range":{"merkleHash":"GTFaT4L6IBCq++l7YeNniQxtk4y4eeBvGjEp9W7/9GE=","range":{"lower":1012590572837164000,"upper":1162204141445591300}}}},"signature":{"pub_key":"5ab31edeb79df6d87a53420525fad6956c297a584e5ef0bb2e561dc16bf28d29","signature":"MCkOt1b5zhTz+QVSyqoH3eZ/sKDoNxeILilJmTyK0LOOV1SWgb866C/HQl+Jwq9e3PKKndLRN66ScTrpD107Dw=="}},"tx":"2QjbCxcNCswHqJpIswqRAwgEEjgKID+dP1JsrQISNRka3MHjI+TH9YxHS8PCyPiPkll7NQExEhQImeLo+qTQvpAQEL+6/pHFrauBEhI4CiBBhFeqfOJX5nGaKtVQBMII22dL2bjHhr3uZ1DGpdd27hIUCL+6/pHFrauBEhDU272Q3OHAwBgSLgogjxFdj77UYyRXUNVDFLF+tCV6XdETVPtDJNrQoY62asUSChC2qPmmrbjchg4SOAogYwqfyM/fkJhQwMvgpkEvZzW+1Kkhbfr3leh7VYHANbQSFAjU272Q3OHAwBgQ97+QnsPH5uwtEjkKIG01Md/DqzL0RKQFBbHjotSwo05NEj68T94CcBHL6/+VEhUI97+QnsPH5uwtELrOne+3gYvaigESOgogHVD7/mgvrIIbvdlphUr1+vpv7qjqUBpl8QoS1j481AMSFgi6zp3vt4GL2ooBEOH2nJut9ZP0+wEaOAogGTFaT4L6IBCq++l7YeNniQxtk4y4eeBvGjEp9W7/9GESFAi2qPmmrbjchg4QmeLo+qTQvpAQEq8ElaQhEQpAMGI1YmM0MjZlOGM4NTQ1M2NlZDhjZmY5MTM1MGI2MmY0ZWZjN2IyNTMyZjQzNmE2NDE4Njg1NTVkMjI3NDA0ZBCu0YXBtKfUJhj5ygEiQDVhYjMxZWRlYjc5ZGY2ZDg3YTUzNDIwNTI1ZmFkNjk1NmMyOTdhNTg0ZTVlZjBiYjJlNTYxZGMxNmJmMjhkMjkqBDAwMjEyjgIKBTAuMC4xEkAyMDk5ZTUxZTcyZWNlODQ1OGIwOTY4MDg5OWE3NDdlMTE0MzQzYjY2YmVjMDBmMjcyZDA5MGRhOTZhYWViNDM2GkBlN2U5MTIwMjU3M2JkZDE5MjdiMDBmY2U5YjBiNDZmYTc5NDRiMDZlNmZlMWJjOTg3YWJjODZlNGQwZGQ0N2Q2IoABNjE3Mjk0MmNlMjZmM2YxMWVhZDUwNWIzNmRiYTdjNTZjYTBjYjA4NDAzYjAyMTRiMzM3YTNmYzA5ZmJhNzQzNDFiNjYwMDMxMmU1ODgyNWU0OGYyZDIwOTMwOTY2ZWVhYTdhOWM3MzJmMmQ1YmQxN2NhOGU1ODI3OWQ2MzA0MGM6gAEwNDkwNWU0YTY3YTgxN2NiYzgxNjNmMjYyMGMyNzkyNTEwZTRlMWI3MTE5MzM4ZGQ0MDlhMzJhZmUyN2E2MWUyNTIwNzRhZjU4MGZhZGExZTNmZDU3MTMwNDQ3OTdlN2NjN2U4MGU3ZjczNWFlZjU1M2U2NzFjZWQ5M2YyNTIwNRgBEg4KBXVwb2t0EgUxMDAwMBppCiWdVEd0IFqzHt63nfbYelNCBSX61pVsKXpYTl7wuy5WHcFr8o0pEkAwKQ63VvnOFPP5BVLKqgfd5n+woOg3F4guKUmZPIrQs45XVJaBvzroL8dCX4nCr17c8oqd0tE3rpJxOukPXTsPKPXZtqyxnaOkmAE=","tx_result":{"code":0,"codespace":"","data":null,"events":[{"attributes":[{"key":"c2VuZGVy","value":"ZGI5NWI1YjgwYjRmMDQ0ZGFjNjUwNjhlODMzOGZkNGFjMzkwNTMyYg=="}],"type":"message"},{"attributes":[{"key":"cmVjaXBpZW50","value":"ZGI5NWI1YjgwYjRmMDQ0ZGFjNjUwNjhlODMzOGZkNGFjMzkwNTMyYg=="},{"key":"YW1vdW50","value":"MjkyODEwMHVwb2t0"}],"type":"transfer"},{"attributes":[{"key":"c2VuZGVy","value":"OGVmOTdiNDg4ZTY2YTJiMmU4OWEzYjQ5OTk1NDk4MTY3Njg5MTBmYg=="}],"type":"message"},{"attributes":[{"key":"cmVjaXBpZW50","value":"ZjE4Mjk2NzZkYjU3NzY4MmU5NDRmYzM0OTNkNDUxYjY3ZmYzZTI5Zg=="},{"key":"YW1vdW50","value":"MzYxOTAwdXBva3Q="}],"type":"transfer"},{"attributes":[{"key":"c2VuZGVy","value":"OGVmOTdiNDg4ZTY2YTJiMmU4OWEzYjQ5OTk1NDk4MTY3Njg5MTBmYg=="}],"type":"message"},{"attributes":[{"key":"dmFsaWRhdG9y","value":"ZGI5NWI1YjgwYjRmMDQ0ZGFjNjUwNjhlODMzOGZkNGFjMzkwNTMyYg=="}],"type":"proof"},{"attributes":[{"key":"cmVjaXBpZW50","value":"ZjE4Mjk2NzZkYjU3NzY4MmU5NDRmYzM0OTNkNDUxYjY3ZmYzZTI5Zg=="},{"key":"YW1vdW50","value":"MTAwMDB1cG9rdA=="}],"type":"transfer"},{"attributes":[{"key":"c2VuZGVy","value":"M2YyODNhOTdmMWY2MjA1M2JlNzVmNjNlODgyYmRlOWFlZTY1YWRkMA=="}],"type":"message"},{"attributes":[{"key":"cmVjaXBpZW50","value":"ZjE4Mjk2NzZkYjU3NzY4MmU5NDRmYzM0OTNkNDUxYjY3ZmYzZTI5Zg=="},{"key":"YW1vdW50","value":"MTAwMDB1cG9rdA=="}],"type":"transfer"},{"attributes":[{"key":"c2VuZGVy","value":"M2Y1NTMxNGViNzQyY2MzZjc2ZGViOWI1Zjk3NTNlY2YzM2IwNjhhYw=="}],"type":"message"},{"attributes":[{"key":"cmVjaXBpZW50","value":"M2Y1NTMxNGViNzQyY2MzZjc2ZGViOWI1Zjk3NTNlY2YzM2IwNjhhYw=="},{"key":"YW1vdW50","value":"NTUxODAwdXBva3Q="}],"type":"transfer"},{"attributes":[{"key":"c2VuZGVy","value":"OGVmOTdiNDg4ZTY2YTJiMmU4OWEzYjQ5OTk1NDk4MTY3Njg5MTBmYg=="}],"type":"message"},{"attributes":[{"key":"cmVjaXBpZW50","value":"ZjE4Mjk2NzZkYjU3NzY4MmU5NDRmYzM0OTNkNDUxYjY3ZmYzZTI5Zg=="},{"key":"YW1vdW50","value":"NjgyMDB1cG9rdA=="}],"type":"transfer"},{"attributes":[{"key":"c2VuZGVy","value":"OGVmOTdiNDg4ZTY2YTJiMmU4OWEzYjQ5OTk1NDk4MTY3Njg5MTBmYg=="}],"type":"message"},{"attributes":[{"key":"dmFsaWRhdG9y","value":"M2Y1NTMxNGViNzQyY2MzZjc2ZGViOWI1Zjk3NTNlY2YzM2IwNjhhYw=="}],"type":"proof"}],"gasUsed":"0","gasWanted":"0","info":"","log":""}}]}';
    const data: any = this.createData(code, accountTxs);

    const response = this.getResponseObject(data, code);
    return this.nockRoute(
      V1RPCRoutes.QueryAccountTxs.toString(),
      code,
      response.data
    );
  }

  public static mockBlockTxs(code: number = 200): nock.Scope {
    const blockTxs = `{"total_count":2,"txs":[{"hash":"CC066D6B794CF9B3D740FD053675953AE46FAF4562296389133F7D20059BE6A0","height":15997,"index":0,"proof":{"data":null,"proof":{"aunts":null,"index":0,"leaf_hash":null,"total":0},"root_hash":""},"stdTx":{"entropy":8253564254111821000,"fee":[{"amount":"10000","denom":"upokt"}],"memo":"","msg":{"validator_address":"5b84d9e53fe6c48502b869995c38dff5ca1e61ef"},"signature":{"pub_key":"af7f6a1ed8d0a5e454546691e83c26a8c2668e0ae668d614e41089da713d0973","signature":"2PuzKS3ozEWnuDDEAGWQOG82c4SY61FjCmaQyD0su5bGA2eJu6KGPbGYGeMlADrmVqT7INp6QSRGDR0EFbx7Cg=="}},"tx":"pQHbCxcNChrJR9B8ChRbhNnlP+bEhQK4aZlcON\/1yh5h7xIOCgV1cG9rdBIFMTAwMDAaaQolnVRHdCCvf2oe2NCl5FRUZpHoPCaowmaOCuZo1hTkEInacT0JcxJA2PuzKS3ozEWnuDDEAGWQOG82c4SY61FjCmaQyD0su5bGA2eJu6KGPbGYGeMlADrmVqT7INp6QSRGDR0EFbx7CiiC2snJ256jxXI=","tx_result":{"code":110,"codespace":"pos","data":null,"events":[{"attributes":[{"key":"YWN0aW9u","value":"YmVnaW5fdW5zdGFrZV92YWxpZGF0b3I="}],"type":"message"}],"gasUsed":"0","gasWanted":"0","info":"","log":""}},{"hash":"0C57593EC5D7CB3BD9D2EBAB09674080FF927A7D6A8CD1C4FFE2007117448ED9","height":15997,"index":1,"proof":{"data":null,"proof":{"aunts":null,"index":0,"leaf_hash":null,"total":0},"root_hash":""},"stdTx":{"entropy":-5248475836032479000,"fee":[{"amount":"10000","denom":"upokt"}],"memo":"","msg":{"evidence_type":1,"leaf":{"aat":{"app_pub_key":"48555bfb7c285c79216b1854767efc3ea10ede65ec6353726586c4ffe4cab089","client_pub_key":"e7e91202573bdd1927b00fce9b0b46fa7944b06e6fe1bc987abc86e4d0dd47d6","signature":"472c55a1cad03fd11496a370983a69af8f9178da613160ec7aed600e8822325f18f82e69cdae457f3ffc915d8d1b6adf1a7ac96ae3382f1af0792e378fe70f0c","version":"0.0.1"},"blockchain":"0021","entropy":5630541707645831,"request_hash":"cf886de56d6a39a4b3767c94ff710802c1129bb7093e5e599b54db49342c5b25","servicer_pub_key":"35afb8fd4e2b77d48618f60fed5955722f385afc931eb1c732df960e86187923","session_block_height":15981,"signature":"4c026ea18799db8125c6d203ee4161b9ef25427d688ec667276194a41576b5453fc656abf83faafc37e5bfbe28beeb5481cea441d443134f9305e88a0229f906"},"merkle_proofs":{"hash_ranges":[{"merkleHash":"sW2loBlldgOfymi1ljGrl\/uFpo2tV6exyf5D40AkSEU=","range":{"lower":248150100462727100,"upper":249497990109425100}},{"merkleHash":"z1ZAyRe8rQO7Trk50GkevwRcEFzWZ0YZHBp+VzGGWKg=","range":{"lower":225227049986841440,"upper":245181239664806940}},{"merkleHash":"7gH50Ql+ZNmRc7a6Bxv7REFhrzVsp5m+euXgZ64IWgE=","range":{"lower":178485382219533200,"upper":225227049986841440}},{"merkleHash":"H1TWoLaCvp\/jtTBvIZTnejv94XaU716L1\/YSMcYKyW4=","range":{"lower":0,"upper":178485382219533200}},{"merkleHash":"kTMximROLsDCLTcvavebcFdUa9\/btjLzk6+II\/DUhlk=","range":{"lower":249497990109425100,"upper":433526953985178300}},{"merkleHash":"b1fo87IK3FSnAORRX+VV2Kot4fXlfYpvffwp9gkgIDU=","range":{"lower":433526953985178300,"upper":727706298537652000}},{"merkleHash":"ktXVHFE7vdfp5oHzpQLsP2bNHCywnyfpKZK5Suvh2BQ=","range":{"lower":727706298537652000,"upper":1331630273653227300}},{"merkleHash":"WS4keL3h6tCx0aC294v4bdLvd9nWcrFrS4At7fF3IM4=","range":{"lower":1331630273653227300,"upper":2654169417373015000}},{"merkleHash":"mq\/wKMSLnGyAcmwjc8TDrlxWDMPm23Kh63JJz7bqe+0=","range":{"lower":2654169417373015000,"upper":5582968288051684000}},{"merkleHash":"75wYEAkG9E5MagBheWwXyEe2CgOG8UQ4tofVU0oIVNg=","range":{"lower":5582968288051684000,"upper":1.0974222917659574e+19}},{"merkleHash":"ZZJy9+cRNZAE8mERbySV5tM3GAh+73n\/cQpxATbjSrE=","range":{"lower":1.0974222917659574e+19,"upper":1.8441057231632015e+19}}],"index":14,"target_range":{"merkleHash":"sO8OnTObcQMJTaw6+cAjEk+\/wue\/KSyY+LTMZSEZH84=","range":{"lower":245181239664806940,"upper":248150100462727100}}}},"signature":{"pub_key":"35afb8fd4e2b77d48618f60fed5955722f385afc931eb1c732df960e86187923","signature":"T2NB2pCAwgGkOvYDiJkvCEWKES+OGI6VezibnLe7LMgaSIxqMOZVmVf8LybgzedTRLZqi66XOdwAH3KZyxr\/Aw=="}},"tx":"+grbCxcNCu0JqJpIswqzBQgOEjgKILFtpaAZZXYDn8potZYxq5f7haaNrVenscn+Q+NAJEhFEhQIsN+76Lnm5rgDELHblYWao5m7AxI4CiDPVkDJF7ytA7tOuTnQaR6\/BFwQXNZnRhkcGn5XMYZYqBIUCOK2maLw2YqQAxClmL6+neHDswMSOAog7gH50Ql+ZNmRc7a6Bxv7REFhrzVsp5m+euXgZ64IWgESFAj5lq7mpvCGvQIQ4raZovDZipADEi4KIB9U1qC2gr6f47UwbyGU53o7\/eF2lO9ei9f2EjHGCsluEgoQ+Zau5qbwhr0CEjgKIJEzMYpkTi7Awi03L2r3m3BXVGvf27Yy85OviCPw1IZZEhQIsduVhZqjmbsDELD13+b7zoyCBhI4CiBvV+jzsgrcVKcA5FFf5VXYqi3h9eV9im99\/Cn2CSAgNRIUCLD13+b7zoyCBhD53ZqJ3qDVjAoSOAogktXVHFE7vdfp5oHzpQLsP2bNHCywnyfpKZK5Suvh2BQSFAj53ZqJ3qDVjAoQkP6GytvVub0SEjgKIFkuJHi94erQsdGgtveL+G3S73fZ1nKxa0uALe3xdyDOEhQIkP6GytvVub0SEPy45YHdoODqJBI4CiCar\/AoxIucbIBybCNzxMOuXFYMw+bbcqHrcknPtup77RIUCPy45YHdoODqJBCOyN2MwIKsvU0SOQog75wYEAkG9E5MagBheWwXyEe2CgOG8UQ4tofVU0oIVNgSFQiOyN2MwIKsvU0QrP2yqJizkaaYARI6CiBlknL35xE1kATyYRFvJJXm0zcYCH7vef9xCnEBNuNKsRIWCKz9sqiYs5GmmAEQ9rjMsI778vX\/ARo4CiCw7w6dM5txAwlNrDr5wCMST7\/C578pLJj4tMxlIRkfzhIUCKWYvr6d4cOzAxCw37vouebmuAMSrgSVpCERCkBjZjg4NmRlNTZkNmEzOWE0YjM3NjdjOTRmZjcxMDgwMmMxMTI5YmI3MDkzZTVlNTk5YjU0ZGI0OTM0MmM1YjI1EIengrOqnoAKGO18IkAzNWFmYjhmZDRlMmI3N2Q0ODYxOGY2MGZlZDU5NTU3MjJmMzg1YWZjOTMxZWIxYzczMmRmOTYwZTg2MTg3OTIzKgQwMDIxMo4CCgUwLjAuMRJANDg1NTViZmI3YzI4NWM3OTIxNmIxODU0NzY3ZWZjM2VhMTBlZGU2NWVjNjM1MzcyNjU4NmM0ZmZlNGNhYjA4ORpAZTdlOTEyMDI1NzNiZGQxOTI3YjAwZmNlOWIwYjQ2ZmE3OTQ0YjA2ZTZmZTFiYzk4N2FiYzg2ZTRkMGRkNDdkNiKAATQ3MmM1NWExY2FkMDNmZDExNDk2YTM3MDk4M2E2OWFmOGY5MTc4ZGE2MTMxNjBlYzdhZWQ2MDBlODgyMjMyNWYxOGY4MmU2OWNkYWU0NTdmM2ZmYzkxNWQ4ZDFiNmFkZjFhN2FjOTZhZTMzODJmMWFmMDc5MmUzNzhmZTcwZjBjOoABNGMwMjZlYTE4Nzk5ZGI4MTI1YzZkMjAzZWU0MTYxYjllZjI1NDI3ZDY4OGVjNjY3Mjc2MTk0YTQxNTc2YjU0NTNmYzY1NmFiZjgzZmFhZmMzN2U1YmZiZTI4YmVlYjU0ODFjZWE0NDFkNDQzMTM0ZjkzMDVlODhhMDIyOWY5MDYYARIOCgV1cG9rdBIFMTAwMDAaaQolnVRHdCA1r7j9Tit31IYY9g\/tWVVyLzha\/JMesccy35YOhhh5IxJAT2NB2pCAwgGkOvYDiJkvCEWKES+OGI6VezibnLe7LMgaSIxqMOZVmVf8LybgzedTRLZqi66XOdwAH3KZyxr\/AyiTnMCojuHqlLcB","tx_result":{"code":0,"codespace":"","data":null,"events":[{"attributes":[{"key":"YWN0aW9u","value":"cHJvb2Y="}],"type":"message"},{"attributes":[{"key":"cmVjaXBpZW50","value":"ZjE4Mjk2NzZkYjU3NzY4MmU5NDRmYzM0OTNkNDUxYjY3ZmYzZTI5Zg=="},{"key":"YW1vdW50","value":"MTAwMDB1cG9rdA=="}],"type":"transfer"},{"attributes":[{"key":"c2VuZGVy","value":"NWI4NGQ5ZTUzZmU2YzQ4NTAyYjg2OTk5NWMzOGRmZjVjYTFlNjFlZg=="}],"type":"message"},{"attributes":[{"key":"cmVjaXBpZW50","value":"ZjE4Mjk2NzZkYjU3NzY4MmU5NDRmYzM0OTNkNDUxYjY3ZmYzZTI5Zg=="},{"key":"YW1vdW50","value":"MTAwMDB1cG9rdA=="}],"type":"transfer"},{"attributes":[{"key":"c2VuZGVy","value":"NjVjY2ZiMDAxZTRkOWUwZGMzNjJjZDBmOGNlZjI5Yjk5N2Y3MmYxOQ=="}],"type":"message"},{"attributes":[{"key":"cmVjaXBpZW50","value":"NjVjY2ZiMDAxZTRkOWUwZGMzNjJjZDBmOGNlZjI5Yjk5N2Y3MmYxOQ=="},{"key":"YW1vdW50","value":"MTUzNzkyMDB1cG9rdA=="}],"type":"transfer"},{"attributes":[{"key":"c2VuZGVy","value":"OGVmOTdiNDg4ZTY2YTJiMmU4OWEzYjQ5OTk1NDk4MTY3Njg5MTBmYg=="}],"type":"message"},{"attributes":[{"key":"cmVjaXBpZW50","value":"ZjE4Mjk2NzZkYjU3NzY4MmU5NDRmYzM0OTNkNDUxYjY3ZmYzZTI5Zg=="},{"key":"YW1vdW50","value":"MTkwMDgwMHVwb2t0"}],"type":"transfer"},{"attributes":[{"key":"c2VuZGVy","value":"OGVmOTdiNDg4ZTY2YTJiMmU4OWEzYjQ5OTk1NDk4MTY3Njg5MTBmYg=="}],"type":"message"},{"attributes":[{"key":"dmFsaWRhdG9y","value":"NjVjY2ZiMDAxZTRkOWUwZGMzNjJjZDBmOGNlZjI5Yjk5N2Y3MmYxOQ=="}],"type":"proof"}],"gasUsed":"0","gasWanted":"0","info":"","log":""}}]}`;
    const data: any = this.createData(code, blockTxs);

    const response = this.getResponseObject(data, code);
    return this.nockRoute(
      V1RPCRoutes.QueryBlockTxs.toString(),
      code,
      response.data
    );
  }

  public static mockBlockTxsWithProve(code: number = 200): nock.Scope {
    const blockTxs = `{"total_count":2,"txs":[{"hash":"CC066D6B794CF9B3D740FD053675953AE46FAF4562296389133F7D20059BE6A0","height":15997,"index":0,"proof":{"data":"pQHbCxcNChrJR9B8ChRbhNnlP+bEhQK4aZlcON\/1yh5h7xIOCgV1cG9rdBIFMTAwMDAaaQolnVRHdCCvf2oe2NCl5FRUZpHoPCaowmaOCuZo1hTkEInacT0JcxJA2PuzKS3ozEWnuDDEAGWQOG82c4SY61FjCmaQyD0su5bGA2eJu6KGPbGYGeMlADrmVqT7INp6QSRGDR0EFbx7CiiC2snJ256jxXI=","proof":{"aunts":["oKZDppPDEuh\/fEJFPp08JeMB2Z2nx1vQHwSIDpS2np0=","3JTmFFwexY2gndN9xoFkPjJYr7RGAS7FLohtTCF1zC0=","PgCiEsgMMXGUiirQgs\/w+HD+UYlSs93xUaPwKRn4pBg=","vfqvVfoThWo3t4846KOhX3uMaagmz6Ci7lG3IlI4blQ=","qpWg+m3dG9uQJpmsSICwj7+02PhGplMu868aQGEa8xk=","bclnzRwxjRTCagtA4+W\/rsr6bc5qmwl3NcjkGbps5x8="],"index":0,"leaf_hash":"aOS5vpRpo1Y9KXX15NR5vOKrg4TaEUTfryi7oAAAcms=","total":55},"root_hash":"3AEBEC5FAE8E6A6D57786276A8C76BDEDE4E83082483DB3C98A48ABF8F5BEB11"},"stdTx":{"entropy":8253564254111821000,"fee":[{"amount":"10000","denom":"upokt"}],"memo":"","msg":{"validator_address":"5b84d9e53fe6c48502b869995c38dff5ca1e61ef"},"signature":{"pub_key":"af7f6a1ed8d0a5e454546691e83c26a8c2668e0ae668d614e41089da713d0973","signature":"2PuzKS3ozEWnuDDEAGWQOG82c4SY61FjCmaQyD0su5bGA2eJu6KGPbGYGeMlADrmVqT7INp6QSRGDR0EFbx7Cg=="}},"tx":"pQHbCxcNChrJR9B8ChRbhNnlP+bEhQK4aZlcON\/1yh5h7xIOCgV1cG9rdBIFMTAwMDAaaQolnVRHdCCvf2oe2NCl5FRUZpHoPCaowmaOCuZo1hTkEInacT0JcxJA2PuzKS3ozEWnuDDEAGWQOG82c4SY61FjCmaQyD0su5bGA2eJu6KGPbGYGeMlADrmVqT7INp6QSRGDR0EFbx7CiiC2snJ256jxXI=","tx_result":{"code":110,"codespace":"pos","data":null,"events":[{"attributes":[{"key":"YWN0aW9u","value":"YmVnaW5fdW5zdGFrZV92YWxpZGF0b3I="}],"type":"message"}],"gasUsed":"0","gasWanted":"0","info":"","log":""}},{"hash":"0C57593EC5D7CB3BD9D2EBAB09674080FF927A7D6A8CD1C4FFE2007117448ED9","height":15997,"index":1,"proof":{"data":"+grbCxcNCu0JqJpIswqzBQgOEjgKILFtpaAZZXYDn8potZYxq5f7haaNrVenscn+Q+NAJEhFEhQIsN+76Lnm5rgDELHblYWao5m7AxI4CiDPVkDJF7ytA7tOuTnQaR6\/BFwQXNZnRhkcGn5XMYZYqBIUCOK2maLw2YqQAxClmL6+neHDswMSOAog7gH50Ql+ZNmRc7a6Bxv7REFhrzVsp5m+euXgZ64IWgESFAj5lq7mpvCGvQIQ4raZovDZipADEi4KIB9U1qC2gr6f47UwbyGU53o7\/eF2lO9ei9f2EjHGCsluEgoQ+Zau5qbwhr0CEjgKIJEzMYpkTi7Awi03L2r3m3BXVGvf27Yy85OviCPw1IZZEhQIsduVhZqjmbsDELD13+b7zoyCBhI4CiBvV+jzsgrcVKcA5FFf5VXYqi3h9eV9im99\/Cn2CSAgNRIUCLD13+b7zoyCBhD53ZqJ3qDVjAoSOAogktXVHFE7vdfp5oHzpQLsP2bNHCywnyfpKZK5Suvh2BQSFAj53ZqJ3qDVjAoQkP6GytvVub0SEjgKIFkuJHi94erQsdGgtveL+G3S73fZ1nKxa0uALe3xdyDOEhQIkP6GytvVub0SEPy45YHdoODqJBI4CiCar\/AoxIucbIBybCNzxMOuXFYMw+bbcqHrcknPtup77RIUCPy45YHdoODqJBCOyN2MwIKsvU0SOQog75wYEAkG9E5MagBheWwXyEe2CgOG8UQ4tofVU0oIVNgSFQiOyN2MwIKsvU0QrP2yqJizkaaYARI6CiBlknL35xE1kATyYRFvJJXm0zcYCH7vef9xCnEBNuNKsRIWCKz9sqiYs5GmmAEQ9rjMsI778vX\/ARo4CiCw7w6dM5txAwlNrDr5wCMST7\/C578pLJj4tMxlIRkfzhIUCKWYvr6d4cOzAxCw37vouebmuAMSrgSVpCERCkBjZjg4NmRlNTZkNmEzOWE0YjM3NjdjOTRmZjcxMDgwMmMxMTI5YmI3MDkzZTVlNTk5YjU0ZGI0OTM0MmM1YjI1EIengrOqnoAKGO18IkAzNWFmYjhmZDRlMmI3N2Q0ODYxOGY2MGZlZDU5NTU3MjJmMzg1YWZjOTMxZWIxYzczMmRmOTYwZTg2MTg3OTIzKgQwMDIxMo4CCgUwLjAuMRJANDg1NTViZmI3YzI4NWM3OTIxNmIxODU0NzY3ZWZjM2VhMTBlZGU2NWVjNjM1MzcyNjU4NmM0ZmZlNGNhYjA4ORpAZTdlOTEyMDI1NzNiZGQxOTI3YjAwZmNlOWIwYjQ2ZmE3OTQ0YjA2ZTZmZTFiYzk4N2FiYzg2ZTRkMGRkNDdkNiKAATQ3MmM1NWExY2FkMDNmZDExNDk2YTM3MDk4M2E2OWFmOGY5MTc4ZGE2MTMxNjBlYzdhZWQ2MDBlODgyMjMyNWYxOGY4MmU2OWNkYWU0NTdmM2ZmYzkxNWQ4ZDFiNmFkZjFhN2FjOTZhZTMzODJmMWFmMDc5MmUzNzhmZTcwZjBjOoABNGMwMjZlYTE4Nzk5ZGI4MTI1YzZkMjAzZWU0MTYxYjllZjI1NDI3ZDY4OGVjNjY3Mjc2MTk0YTQxNTc2YjU0NTNmYzY1NmFiZjgzZmFhZmMzN2U1YmZiZTI4YmVlYjU0ODFjZWE0NDFkNDQzMTM0ZjkzMDVlODhhMDIyOWY5MDYYARIOCgV1cG9rdBIFMTAwMDAaaQolnVRHdCA1r7j9Tit31IYY9g\/tWVVyLzha\/JMesccy35YOhhh5IxJAT2NB2pCAwgGkOvYDiJkvCEWKES+OGI6VezibnLe7LMgaSIxqMOZVmVf8LybgzedTRLZqi66XOdwAH3KZyxr\/AyiTnMCojuHqlLcB","proof":{"aunts":["aOS5vpRpo1Y9KXX15NR5vOKrg4TaEUTfryi7oAAAcms=","3JTmFFwexY2gndN9xoFkPjJYr7RGAS7FLohtTCF1zC0=","PgCiEsgMMXGUiirQgs\/w+HD+UYlSs93xUaPwKRn4pBg=","vfqvVfoThWo3t4846KOhX3uMaagmz6Ci7lG3IlI4blQ=","qpWg+m3dG9uQJpmsSICwj7+02PhGplMu868aQGEa8xk=","bclnzRwxjRTCagtA4+W\/rsr6bc5qmwl3NcjkGbps5x8="],"index":1,"leaf_hash":"oKZDppPDEuh\/fEJFPp08JeMB2Z2nx1vQHwSIDpS2np0=","total":55},"root_hash":"3AEBEC5FAE8E6A6D57786276A8C76BDEDE4E83082483DB3C98A48ABF8F5BEB11"},"stdTx":{"entropy":-5248475836032479000,"fee":[{"amount":"10000","denom":"upokt"}],"memo":"","msg":{"evidence_type":1,"leaf":{"aat":{"app_pub_key":"48555bfb7c285c79216b1854767efc3ea10ede65ec6353726586c4ffe4cab089","client_pub_key":"e7e91202573bdd1927b00fce9b0b46fa7944b06e6fe1bc987abc86e4d0dd47d6","signature":"472c55a1cad03fd11496a370983a69af8f9178da613160ec7aed600e8822325f18f82e69cdae457f3ffc915d8d1b6adf1a7ac96ae3382f1af0792e378fe70f0c","version":"0.0.1"},"blockchain":"0021","entropy":5630541707645831,"request_hash":"cf886de56d6a39a4b3767c94ff710802c1129bb7093e5e599b54db49342c5b25","servicer_pub_key":"35afb8fd4e2b77d48618f60fed5955722f385afc931eb1c732df960e86187923","session_block_height":15981,"signature":"4c026ea18799db8125c6d203ee4161b9ef25427d688ec667276194a41576b5453fc656abf83faafc37e5bfbe28beeb5481cea441d443134f9305e88a0229f906"},"merkle_proofs":{"hash_ranges":[{"merkleHash":"sW2loBlldgOfymi1ljGrl\/uFpo2tV6exyf5D40AkSEU=","range":{"lower":248150100462727100,"upper":249497990109425100}},{"merkleHash":"z1ZAyRe8rQO7Trk50GkevwRcEFzWZ0YZHBp+VzGGWKg=","range":{"lower":225227049986841440,"upper":245181239664806940}},{"merkleHash":"7gH50Ql+ZNmRc7a6Bxv7REFhrzVsp5m+euXgZ64IWgE=","range":{"lower":178485382219533200,"upper":225227049986841440}},{"merkleHash":"H1TWoLaCvp\/jtTBvIZTnejv94XaU716L1\/YSMcYKyW4=","range":{"lower":0,"upper":178485382219533200}},{"merkleHash":"kTMximROLsDCLTcvavebcFdUa9\/btjLzk6+II\/DUhlk=","range":{"lower":249497990109425100,"upper":433526953985178300}},{"merkleHash":"b1fo87IK3FSnAORRX+VV2Kot4fXlfYpvffwp9gkgIDU=","range":{"lower":433526953985178300,"upper":727706298537652000}},{"merkleHash":"ktXVHFE7vdfp5oHzpQLsP2bNHCywnyfpKZK5Suvh2BQ=","range":{"lower":727706298537652000,"upper":1331630273653227300}},{"merkleHash":"WS4keL3h6tCx0aC294v4bdLvd9nWcrFrS4At7fF3IM4=","range":{"lower":1331630273653227300,"upper":2654169417373015000}},{"merkleHash":"mq\/wKMSLnGyAcmwjc8TDrlxWDMPm23Kh63JJz7bqe+0=","range":{"lower":2654169417373015000,"upper":5582968288051684000}},{"merkleHash":"75wYEAkG9E5MagBheWwXyEe2CgOG8UQ4tofVU0oIVNg=","range":{"lower":5582968288051684000,"upper":1.0974222917659574e+19}},{"merkleHash":"ZZJy9+cRNZAE8mERbySV5tM3GAh+73n\/cQpxATbjSrE=","range":{"lower":1.0974222917659574e+19,"upper":1.8441057231632015e+19}}],"index":14,"target_range":{"merkleHash":"sO8OnTObcQMJTaw6+cAjEk+\/wue\/KSyY+LTMZSEZH84=","range":{"lower":245181239664806940,"upper":248150100462727100}}}},"signature":{"pub_key":"35afb8fd4e2b77d48618f60fed5955722f385afc931eb1c732df960e86187923","signature":"T2NB2pCAwgGkOvYDiJkvCEWKES+OGI6VezibnLe7LMgaSIxqMOZVmVf8LybgzedTRLZqi66XOdwAH3KZyxr\/Aw=="}},"tx":"+grbCxcNCu0JqJpIswqzBQgOEjgKILFtpaAZZXYDn8potZYxq5f7haaNrVenscn+Q+NAJEhFEhQIsN+76Lnm5rgDELHblYWao5m7AxI4CiDPVkDJF7ytA7tOuTnQaR6\/BFwQXNZnRhkcGn5XMYZYqBIUCOK2maLw2YqQAxClmL6+neHDswMSOAog7gH50Ql+ZNmRc7a6Bxv7REFhrzVsp5m+euXgZ64IWgESFAj5lq7mpvCGvQIQ4raZovDZipADEi4KIB9U1qC2gr6f47UwbyGU53o7\/eF2lO9ei9f2EjHGCsluEgoQ+Zau5qbwhr0CEjgKIJEzMYpkTi7Awi03L2r3m3BXVGvf27Yy85OviCPw1IZZEhQIsduVhZqjmbsDELD13+b7zoyCBhI4CiBvV+jzsgrcVKcA5FFf5VXYqi3h9eV9im99\/Cn2CSAgNRIUCLD13+b7zoyCBhD53ZqJ3qDVjAoSOAogktXVHFE7vdfp5oHzpQLsP2bNHCywnyfpKZK5Suvh2BQSFAj53ZqJ3qDVjAoQkP6GytvVub0SEjgKIFkuJHi94erQsdGgtveL+G3S73fZ1nKxa0uALe3xdyDOEhQIkP6GytvVub0SEPy45YHdoODqJBI4CiCar\/AoxIucbIBybCNzxMOuXFYMw+bbcqHrcknPtup77RIUCPy45YHdoODqJBCOyN2MwIKsvU0SOQog75wYEAkG9E5MagBheWwXyEe2CgOG8UQ4tofVU0oIVNgSFQiOyN2MwIKsvU0QrP2yqJizkaaYARI6CiBlknL35xE1kATyYRFvJJXm0zcYCH7vef9xCnEBNuNKsRIWCKz9sqiYs5GmmAEQ9rjMsI778vX\/ARo4CiCw7w6dM5txAwlNrDr5wCMST7\/C578pLJj4tMxlIRkfzhIUCKWYvr6d4cOzAxCw37vouebmuAMSrgSVpCERCkBjZjg4NmRlNTZkNmEzOWE0YjM3NjdjOTRmZjcxMDgwMmMxMTI5YmI3MDkzZTVlNTk5YjU0ZGI0OTM0MmM1YjI1EIengrOqnoAKGO18IkAzNWFmYjhmZDRlMmI3N2Q0ODYxOGY2MGZlZDU5NTU3MjJmMzg1YWZjOTMxZWIxYzczMmRmOTYwZTg2MTg3OTIzKgQwMDIxMo4CCgUwLjAuMRJANDg1NTViZmI3YzI4NWM3OTIxNmIxODU0NzY3ZWZjM2VhMTBlZGU2NWVjNjM1MzcyNjU4NmM0ZmZlNGNhYjA4ORpAZTdlOTEyMDI1NzNiZGQxOTI3YjAwZmNlOWIwYjQ2ZmE3OTQ0YjA2ZTZmZTFiYzk4N2FiYzg2ZTRkMGRkNDdkNiKAATQ3MmM1NWExY2FkMDNmZDExNDk2YTM3MDk4M2E2OWFmOGY5MTc4ZGE2MTMxNjBlYzdhZWQ2MDBlODgyMjMyNWYxOGY4MmU2OWNkYWU0NTdmM2ZmYzkxNWQ4ZDFiNmFkZjFhN2FjOTZhZTMzODJmMWFmMDc5MmUzNzhmZTcwZjBjOoABNGMwMjZlYTE4Nzk5ZGI4MTI1YzZkMjAzZWU0MTYxYjllZjI1NDI3ZDY4OGVjNjY3Mjc2MTk0YTQxNTc2YjU0NTNmYzY1NmFiZjgzZmFhZmMzN2U1YmZiZTI4YmVlYjU0ODFjZWE0NDFkNDQzMTM0ZjkzMDVlODhhMDIyOWY5MDYYARIOCgV1cG9rdBIFMTAwMDAaaQolnVRHdCA1r7j9Tit31IYY9g\/tWVVyLzha\/JMesccy35YOhhh5IxJAT2NB2pCAwgGkOvYDiJkvCEWKES+OGI6VezibnLe7LMgaSIxqMOZVmVf8LybgzedTRLZqi66XOdwAH3KZyxr\/AyiTnMCojuHqlLcB","tx_result":{"code":0,"codespace":"","data":null,"events":[{"attributes":[{"key":"YWN0aW9u","value":"cHJvb2Y="}],"type":"message"},{"attributes":[{"key":"cmVjaXBpZW50","value":"ZjE4Mjk2NzZkYjU3NzY4MmU5NDRmYzM0OTNkNDUxYjY3ZmYzZTI5Zg=="},{"key":"YW1vdW50","value":"MTAwMDB1cG9rdA=="}],"type":"transfer"},{"attributes":[{"key":"c2VuZGVy","value":"NWI4NGQ5ZTUzZmU2YzQ4NTAyYjg2OTk5NWMzOGRmZjVjYTFlNjFlZg=="}],"type":"message"},{"attributes":[{"key":"cmVjaXBpZW50","value":"ZjE4Mjk2NzZkYjU3NzY4MmU5NDRmYzM0OTNkNDUxYjY3ZmYzZTI5Zg=="},{"key":"YW1vdW50","value":"MTAwMDB1cG9rdA=="}],"type":"transfer"},{"attributes":[{"key":"c2VuZGVy","value":"NjVjY2ZiMDAxZTRkOWUwZGMzNjJjZDBmOGNlZjI5Yjk5N2Y3MmYxOQ=="}],"type":"message"},{"attributes":[{"key":"cmVjaXBpZW50","value":"NjVjY2ZiMDAxZTRkOWUwZGMzNjJjZDBmOGNlZjI5Yjk5N2Y3MmYxOQ=="},{"key":"YW1vdW50","value":"MTUzNzkyMDB1cG9rdA=="}],"type":"transfer"},{"attributes":[{"key":"c2VuZGVy","value":"OGVmOTdiNDg4ZTY2YTJiMmU4OWEzYjQ5OTk1NDk4MTY3Njg5MTBmYg=="}],"type":"message"},{"attributes":[{"key":"cmVjaXBpZW50","value":"ZjE4Mjk2NzZkYjU3NzY4MmU5NDRmYzM0OTNkNDUxYjY3ZmYzZTI5Zg=="},{"key":"YW1vdW50","value":"MTkwMDgwMHVwb2t0"}],"type":"transfer"},{"attributes":[{"key":"c2VuZGVy","value":"OGVmOTdiNDg4ZTY2YTJiMmU4OWEzYjQ5OTk1NDk4MTY3Njg5MTBmYg=="}],"type":"message"},{"attributes":[{"key":"dmFsaWRhdG9y","value":"NjVjY2ZiMDAxZTRkOWUwZGMzNjJjZDBmOGNlZjI5Yjk5N2Y3MmYxOQ=="}],"type":"proof"}],"gasUsed":"0","gasWanted":"0","info":"","log":""}}]}`;
    const data: any = this.createData(code, blockTxs);

    const response = this.getResponseObject(data, code);
    return this.nockRoute(
      V1RPCRoutes.QueryBlockTxs.toString(),
      code,
      response.data
    );
  }

  public static mockGetAllParams(code: number = 200): nock.Scope {
    const allParams =
      '{"app_params":[{"param_key":"application/ParticipationRateOn","param_value":"false"},{"param_key":"application/ApplicationStakeMinimum","param_value":"1000000"},{"param_key":"application/MaximumChains","param_value":"15"},{"param_key":"application/StabilityAdjustment","param_value":"0"},{"param_key":"application/AppUnstakingTime","param_value":"1814000000000000"},{"param_key":"application/BaseRelaysPerPOKT","param_value":"167"},{"param_key":"application/MaxApplications","param_value":"9223372036854775807"}],"auth_params":[{"param_key":"auth/MaxMemoCharacters","param_value":"75"},{"param_key":"auth/FeeMultipliers","param_value":"{\\"fee_multiplier\\":null,\\"default\\":\\"1\\"}"},{"param_key":"auth/TxSigLimit","param_value":"8"}],"gov_params":[{"param_key":"gov/upgrade","param_value":"{\\"type\\":\\"gov/upgrade\\",\\"value\\":{\\"Height\\":\\"0\\",\\"Version\\":\\"0\\"}}"},{"param_key":"gov/daoOwner","param_value":"a83172b67b5ffbfcb8acb95acc0fd0466a9d4bc4"},{"param_key":"gov/acl","param_value":"{\\"type\\":\\"gov/non_map_acl\\",\\"value\\":[{\\"acl_key\\":\\"application/ApplicationStakeMinimum\\",\\"address\\":\\"a83172b67b5ffbfcb8acb95acc0fd0466a9d4bc4\\"},{\\"acl_key\\":\\"application/AppUnstakingTime\\",\\"address\\":\\"a83172b67b5ffbfcb8acb95acc0fd0466a9d4bc4\\"},{\\"acl_key\\":\\"application/BaseRelaysPerPOKT\\",\\"address\\":\\"a83172b67b5ffbfcb8acb95acc0fd0466a9d4bc4\\"},{\\"acl_key\\":\\"application/MaxApplications\\",\\"address\\":\\"a83172b67b5ffbfcb8acb95acc0fd0466a9d4bc4\\"},{\\"acl_key\\":\\"application/MaximumChains\\",\\"address\\":\\"a83172b67b5ffbfcb8acb95acc0fd0466a9d4bc4\\"},{\\"acl_key\\":\\"application/ParticipationRateOn\\",\\"address\\":\\"a83172b67b5ffbfcb8acb95acc0fd0466a9d4bc4\\"},{\\"acl_key\\":\\"application/StabilityAdjustment\\",\\"address\\":\\"a83172b67b5ffbfcb8acb95acc0fd0466a9d4bc4\\"},{\\"acl_key\\":\\"auth/MaxMemoCharacters\\",\\"address\\":\\"a83172b67b5ffbfcb8acb95acc0fd0466a9d4bc4\\"},{\\"acl_key\\":\\"auth/TxSigLimit\\",\\"address\\":\\"a83172b67b5ffbfcb8acb95acc0fd0466a9d4bc4\\"},{\\"acl_key\\":\\"gov/acl\\",\\"address\\":\\"a83172b67b5ffbfcb8acb95acc0fd0466a9d4bc4\\"},{\\"acl_key\\":\\"gov/daoOwner\\",\\"address\\":\\"a83172b67b5ffbfcb8acb95acc0fd0466a9d4bc4\\"},{\\"acl_key\\":\\"gov/upgrade\\",\\"address\\":\\"a83172b67b5ffbfcb8acb95acc0fd0466a9d4bc4\\"},{\\"acl_key\\":\\"pocketcore/ClaimExpiration\\",\\"address\\":\\"a83172b67b5ffbfcb8acb95acc0fd0466a9d4bc4\\"},{\\"acl_key\\":\\"auth/FeeMultipliers\\",\\"address\\":\\"a83172b67b5ffbfcb8acb95acc0fd0466a9d4bc4\\"},{\\"acl_key\\":\\"pocketcore/ReplayAttackBurnMultiplier\\",\\"address\\":\\"a83172b67b5ffbfcb8acb95acc0fd0466a9d4bc4\\"},{\\"acl_key\\":\\"pos/ProposerPercentage\\",\\"address\\":\\"a83172b67b5ffbfcb8acb95acc0fd0466a9d4bc4\\"},{\\"acl_key\\":\\"pocketcore/ClaimSubmissionWindow\\",\\"address\\":\\"a83172b67b5ffbfcb8acb95acc0fd0466a9d4bc4\\"},{\\"acl_key\\":\\"pocketcore/MinimumNumberOfProofs\\",\\"address\\":\\"a83172b67b5ffbfcb8acb95acc0fd0466a9d4bc4\\"},{\\"acl_key\\":\\"pocketcore/SessionNodeCount\\",\\"address\\":\\"a83172b67b5ffbfcb8acb95acc0fd0466a9d4bc4\\"},{\\"acl_key\\":\\"pocketcore/SupportedBlockchains\\",\\"address\\":\\"a83172b67b5ffbfcb8acb95acc0fd0466a9d4bc4\\"},{\\"acl_key\\":\\"pos/BlocksPerSession\\",\\"address\\":\\"a83172b67b5ffbfcb8acb95acc0fd0466a9d4bc4\\"},{\\"acl_key\\":\\"pos/DAOAllocation\\",\\"address\\":\\"a83172b67b5ffbfcb8acb95acc0fd0466a9d4bc4\\"},{\\"acl_key\\":\\"pos/DowntimeJailDuration\\",\\"address\\":\\"a83172b67b5ffbfcb8acb95acc0fd0466a9d4bc4\\"},{\\"acl_key\\":\\"pos/MaxEvidenceAge\\",\\"address\\":\\"a83172b67b5ffbfcb8acb95acc0fd0466a9d4bc4\\"},{\\"acl_key\\":\\"pos/MaximumChains\\",\\"address\\":\\"a83172b67b5ffbfcb8acb95acc0fd0466a9d4bc4\\"},{\\"acl_key\\":\\"pos/MaxJailedBlocks\\",\\"address\\":\\"a83172b67b5ffbfcb8acb95acc0fd0466a9d4bc4\\"},{\\"acl_key\\":\\"pos/MaxValidators\\",\\"address\\":\\"a83172b67b5ffbfcb8acb95acc0fd0466a9d4bc4\\"},{\\"acl_key\\":\\"pos/MinSignedPerWindow\\",\\"address\\":\\"a83172b67b5ffbfcb8acb95acc0fd0466a9d4bc4\\"},{\\"acl_key\\":\\"pos/RelaysToTokensMultiplier\\",\\"address\\":\\"a83172b67b5ffbfcb8acb95acc0fd0466a9d4bc4\\"},{\\"acl_key\\":\\"pos/SignedBlocksWindow\\",\\"address\\":\\"a83172b67b5ffbfcb8acb95acc0fd0466a9d4bc4\\"},{\\"acl_key\\":\\"pos/SlashFractionDoubleSign\\",\\"address\\":\\"a83172b67b5ffbfcb8acb95acc0fd0466a9d4bc4\\"},{\\"acl_key\\":\\"pos/SlashFractionDowntime\\",\\"address\\":\\"a83172b67b5ffbfcb8acb95acc0fd0466a9d4bc4\\"},{\\"acl_key\\":\\"pos/StakeDenom\\",\\"address\\":\\"a83172b67b5ffbfcb8acb95acc0fd0466a9d4bc4\\"},{\\"acl_key\\":\\"pos/StakeMinimum\\",\\"address\\":\\"a83172b67b5ffbfcb8acb95acc0fd0466a9d4bc4\\"},{\\"acl_key\\":\\"pos/UnstakingTime\\",\\"address\\":\\"a83172b67b5ffbfcb8acb95acc0fd0466a9d4bc4\\"}]}"}],"node_params":[{"param_key":"pos/MaxJailedBlocks","param_value":"37960"},{"param_key":"pos/SignedBlocksWindow","param_value":"10"},{"param_key":"pos/StakeDenom","param_value":"upokt"},{"param_key":"pos/MaxEvidenceAge","param_value":"120000000000"},{"param_key":"pos/StakeMinimum","param_value":"15000000000"},{"param_key":"pos/UnstakingTime","param_value":"1814000000000000"},{"param_key":"pos/BlocksPerSession","param_value":"4"},{"param_key":"pos/DAOAllocation","param_value":"10"},{"param_key":"pos/RelaysToTokensMultiplier","param_value":"10000"},{"param_key":"pos/SlashFractionDoubleSign","param_value":"0.050000000000000000"},{"param_key":"pos/DowntimeJailDuration","param_value":"3600000000000"},{"param_key":"pos/MinSignedPerWindow","param_value":"0.600000000000000000"},{"param_key":"pos/MaxValidators","param_value":"5000"},{"param_key":"pos/ProposerPercentage","param_value":"1"},{"param_key":"pos/MaximumChains","param_value":"15"},{"param_key":"pos/SlashFractionDowntime","param_value":"0.000001000000000000"}],"pocket_params":[{"param_key":"pocketcore/SupportedBlockchains","param_value":"[\\"0001\\",\\"0021\\"]"},{"param_key":"pocketcore/SessionNodeCount","param_value":"5"},{"param_key":"pocketcore/ClaimExpiration","param_value":"120"},{"param_key":"pocketcore/ReplayAttackBurnMultiplier","param_value":"3"},{"param_key":"pocketcore/MinimumNumberOfProofs","param_value":"10"},{"param_key":"pocketcore/ClaimSubmissionWindow","param_value":"3"}]}';
    const queryAllParamsResponse = QueryAllParamsResponse.fromJSON(allParams);

    const data: any = this.createData(code, queryAllParamsResponse.toJSON());

    const response = this.getResponseObject(data, code);
    return this.nockRoute(
      V1RPCRoutes.QueryAllParams.toString(),
      code,
      response.data
    );
  }

  public static mockGetNodeClaims(code: number = 200): nock.Scope {
    const nodeClaims =
      '{"page":1,"result":[{"evidence_type":1,"expiration_height":26635,"from_address":"033b2a160343ca53819a0fa40bf76b1dfe280a7f","header":{"app_public_key":"1b74bc3a4f61583159ca9a4702687d68bb478321f278e08e686db318befca21a","chain":"0021","session_height":26533},"merkle_root":{"merkleHash":"Vnh624z23w7gphMrQmhUKXVI8OqA0VUCDYo6v2GZv+I=","range":{"lower":0,"upper":18440474453233244000}},"total_proofs":3920}],"total_pages":1}';
    const data: any = this.createData(code, nodeClaims);

    const response = this.getResponseObject(data, code);
    return this.nockRoute(
      V1RPCRoutes.QueryNodeClaims.toString(),
      code,
      response.data
    );
  }

  public static mockGetNodeClaim(code: number = 200): nock.Scope {
    const nodeClaim =
      '{"type":"pocketcore/claim","value":{"evidence_type":"1","expiration_height":"26635","from_address":"033b2a160343ca53819a0fa40bf76b1dfe280a7f","header":{"app_public_key":"1b74bc3a4f61583159ca9a4702687d68bb478321f278e08e686db318befca21a","chain":"0021","session_height":"26533"},"merkle_root":{"merkleHash":"Vnh624z23w7gphMrQmhUKXVI8OqA0VUCDYo6v2GZv+I=","range":{"lower":"0","upper":"18440474453233243266"}},"total_proofs":"3920"}}';
    const data: any = this.createData(code, nodeClaim);

    const response = this.getResponseObject(data, code);
    return this.nockRoute(
      V1RPCRoutes.QueryNodeClaim.toString(),
      code,
      response.data
    );
  }

  public static mockGetUpgrade(code: number = 200): nock.Scope {
    const upgrade = '{"Height":0,"Version":"0"}';
    const data: any = this.createData(code, upgrade);

    const response = this.getResponseObject(data, code);
    return this.nockRoute(
      V1RPCRoutes.QueryUpgrade.toString(),
      code,
      response.data
    );
  }

  public static mockRelayResponse(code: number = 200): nock.Scope {
    const randomNumber = Math.floor(Math.random() * 100000);
    const relayResponse =
      '{"response":"{\\"id\\":67,\\"jsonrpc\\":\\"2.0\\",\\"result\\":\\"0x1043561a88' +
      randomNumber.toString() +
      '\\"}","signature":"952352cc3b1e915c4470612e7f25b3cf811b30e1a95ab79d0c593d6afcbf0a7d0f50a945345e97c263641dfb8b1ba66911debe0be6d0586268720c3f9b83530f"}';

    const data: any = this.createData(code, relayResponse);

    const result = this.getResponseObject(data, code);
    return this.nockRoute(
      V1RPCRoutes.ClientRelay.toString(),
      code,
      result.data
    );
  }

  // Private functions
  private static getResponseObject(data: {}, code: number) {
    return {
      config: {},
      data: data,
      headers: { "Content-Type": "application/json" },
      status: code,
      statusText: code.toString(),
    };
  }

  private static nockRoute(
    path: string = "",
    code: number = 200,
    data: any
  ): nock.Scope {
    return nock(envUrl.toString()).post(path).reply(code, data);
  }

  private static getError(): any {
    const data: any = {
      code: 500,
      message: "Internal Server Error.",
    };
    const response = this.getResponseObject(data, 500);
    return response;
  }

  private static createData(code: number, payload: any): any {
    if (code === 200) {
      return payload;
    }
    return this.getError();
  }
}
