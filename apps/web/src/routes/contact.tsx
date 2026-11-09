import { createFileRoute } from '@tanstack/react-router'
import { Clock3, ExternalLink, MapPin, Phone, PhoneCall } from 'lucide-react'
import { SectionPage } from '@/components/content/section-page'
import { contactDirectory } from '@/content/contact'

export const Route = createFileRoute('/contact')({ component: ContactPage })

function ContactPage() {
  return (
    <SectionPage
      eyebrow="Directory"
      title="Contact provincial offices"
      description="Find public contact channels and emergency hotlines. For urgent emergencies in the Philippines, call 911."
      icon={Phone}
    >
      <div className="mt-10 grid gap-5 md:grid-cols-3">
        <ContactCard icon={MapPin} label="Address">
          {contactDirectory.address}
        </ContactCard>
        <ContactCard icon={Clock3} label="Office hours">
          {contactDirectory.officeHours}
        </ContactCard>
        <ContactCard icon={PhoneCall} label="Capitol phone">
          <a className="font-semibold text-civic-700" href={`tel:${contactDirectory.phone}`}>
            {contactDirectory.phone}
          </a>
        </ContactCard>
      </div>
      <section className="mt-12">
        <h2 className="text-2xl font-bold text-slate-950">Emergency hotlines</h2>
        <p className="mt-2 max-w-3xl text-slate-600">
          Save these numbers for urgent public safety, disaster response, health, and welfare needs
          in Bukidnon.
        </p>
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {contactDirectory.hotlines.map((hotline) => (
            <a
              key={hotline.label}
              href={hotline.href}
              className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm hover:border-civic-300"
            >
              <span className="text-sm font-semibold text-civic-700">{hotline.label}</span>
              <span className="mt-2 block text-xl font-bold text-slate-950">{hotline.display}</span>
            </a>
          ))}
        </div>
      </section>
      <a
        href={contactDirectory.website}
        target="_blank"
        rel="noreferrer"
        className="mt-10 inline-flex items-center gap-2 font-semibold text-civic-700"
      >
        Visit the official provincial website <ExternalLink className="size-4" />
      </a>
    </SectionPage>
  )
}

function ContactCard({
  icon: Icon,
  label,
  children,
}: {
  icon: typeof MapPin
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <Icon className="size-6 text-civic-700" aria-hidden="true" />
      <p className="mt-4 text-sm font-semibold text-slate-500">{label}</p>
      <div className="mt-1 leading-7 text-slate-900">{children}</div>
    </div>
  )
}
