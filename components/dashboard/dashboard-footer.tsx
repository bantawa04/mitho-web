export function DashboardFooter() {
  return (
    <footer className="bg-brand-soft-beige border-t border-border mt-16">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground text-center sm:text-left">
            © {new Date().getFullYear()} Mitho Cha! All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-sm">
            <a href="#" className="text-muted-foreground hover:text-brand-orange transition-colors">
              Help Center
            </a>
            <a href="#" className="text-muted-foreground hover:text-brand-orange transition-colors">
              Contact Support
            </a>
            <a href="#" className="text-muted-foreground hover:text-brand-orange transition-colors">
              Terms
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
