import { describe, expect, test } from "bun:test"
import { renderToStaticMarkup } from "react-dom/server"
import { StaticMapPreview } from "@/features/business/components/info-panel"

describe("StaticMapPreview", () => {
  test("renders backend map image when url available", () => {
    const markup = renderToStaticMarkup(
      <StaticMapPreview
        staticMapUrl="/api/businesses/biz-1/static-map"
        hasCoordinates
        failed={false}
        address="Kathmandu"
      />,
    )

    expect(markup).toContain('src="/api/businesses/biz-1/static-map"')
    expect(markup).toContain("Map preview for Kathmandu")
  })

  test("renders no-coordinates placeholder", () => {
    const markup = renderToStaticMarkup(
      <StaticMapPreview
        staticMapUrl={null}
        hasCoordinates={false}
        failed={false}
        address="Kathmandu"
      />,
    )

    expect(markup).toContain("Location coordinates not provided")
    expect(markup).toContain("Map preview and directions will appear once latitude and longitude are added.")
  })

  test("renders unavailable placeholder after image failure", () => {
    const markup = renderToStaticMarkup(
      <StaticMapPreview
        staticMapUrl="/api/businesses/biz-1/static-map"
        hasCoordinates
        failed
        address="Kathmandu"
      />,
    )

    expect(markup).toContain("Map preview unavailable")
    expect(markup).toContain("Location preview could not be loaded right now. You can still open directions below.")
  })
})
