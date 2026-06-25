import { describe, expect, test } from "bun:test"
import { getPublicBusinessHref } from "@/lib/business-public-href"

describe("getPublicBusinessHref", () => {
  test("encodes special characters in a publicPath exactly once", () => {
    expect(
      getPublicBusinessHref({
        slug: "unused",
        publicPath: "/koshi/sunsari/dharan/01KVYVND8J4RXTSA5KHFYBKK1Z-sugar-&-spice",
      }),
    ).toBe(
      "/koshi/sunsari/dharan/01KVYVND8J4RXTSA5KHFYBKK1Z-sugar-%26-spice",
    )
  })

  test("does not double-encode an already encoded publicPath", () => {
    expect(
      getPublicBusinessHref({
        slug: "unused",
        publicPath:
          "/koshi/sunsari/dharan/01KVYVND8J4RXTSA5KHFYBKK1Z-sugar-%26-spice",
      }),
    ).toBe(
      "/koshi/sunsari/dharan/01KVYVND8J4RXTSA5KHFYBKK1Z-sugar-%26-spice",
    )
  })

  test("encodes a rebuilt href from route parts and raw slug text", () => {
    expect(
      getPublicBusinessHref({
        id: "01KVYVG69693MAWSEFYPBYW1NB",
        slug: "atmaranjan-outlet-&-cafe",
        province: { slug: "koshi" },
        district: { slug: "sunsari" },
        municipality: { slug: "dharan" },
      }),
    ).toBe(
      "/koshi/sunsari/dharan/01KVYVG69693MAWSEFYPBYW1NB-atmaranjan-outlet-%26-cafe",
    )
  })
})
