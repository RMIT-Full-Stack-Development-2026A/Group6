import PricingBox from './PricingBox'

export default function PricingSection() {
  return (
    <section className="py-12">
      <div className="max-w-4xl mx-auto">
        <PricingBox current="free" />
      </div>
    </section>
  )
}
