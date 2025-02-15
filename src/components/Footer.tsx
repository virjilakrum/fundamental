import { Heart, Github, Twitter, Mail, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  const links = {
    about: [
      { label: 'Our Mission', href: '#' },
      { label: 'Impact Report', href: '#' },
      { label: 'Team', href: '#' },
      { label: 'Careers', href: '#' },
    ],
    support: [
      { label: 'Help Center', href: '#' },
      { label: 'Terms of Service', href: '#' },
      { label: 'Privacy Policy', href: '#' },
      { label: 'Cookie Settings', href: '#' },
    ],
    connect: [
      { label: 'Twitter', href: '#', icon: Twitter },
      { label: 'GitHub', href: '#', icon: Github },
      { label: 'Contact', href: '#', icon: Mail },
    ],
  };

  return (
    <footer className="bg-card-bg border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Heart className="w-8 h-8 text-secondary" />
              <span className="text-xl font-semibold text-primary">Fundamental</span>
            </div>
            <p className="text-muted-text">
              Empowering SMA patients through transparent blockchain donations and community support.
            </p>
            <div className="flex items-center gap-2 text-secondary">
              <Heart className="w-4 h-4" />
              <span className="font-medium">◎ 1,234.56 Total Impact</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-primary mb-4">About</h3>
            <ul className="space-y-2">
              {links.about.map((link) => (
                <motion.li
                  key={link.label}
                  whileHover={{ x: 4 }}
                  className="text-muted-text hover:text-primary transition-colors"
                >
                  <a href={link.href} className="flex items-center gap-1">
                    {link.label}
                  </a>
                </motion.li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="text-lg font-semibold text-primary mb-4">Support</h3>
            <ul className="space-y-2">
              {links.support.map((link) => (
                <motion.li
                  key={link.label}
                  whileHover={{ x: 4 }}
                  className="text-muted-text hover:text-primary transition-colors"
                >
                  <a href={link.href} className="flex items-center gap-1">
                    {link.label}
                  </a>
                </motion.li>
              ))}
            </ul>
          </div>

          {/* Newsletter Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-primary">Stay Updated</h3>
            <p className="text-muted-text">
              Subscribe to our newsletter for impact stories and updates.
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 rounded-xl bg-background border border-gray-800 text-primary focus:ring-2 focus:ring-secondary/20 transition-all"
              />
              <button className="px-4 py-2 bg-secondary text-white rounded-xl hover:bg-secondary/90 transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Social Links & Copyright */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-6">
              {links.connect.map((link) => (
                <motion.a
                  key={link.label}
                  href={link.href}
                  whileHover={{ y: -2 }}
                  className="text-muted-text hover:text-primary transition-colors"
                >
                  <link.icon className="w-5 h-5" />
                </motion.a>
              ))}
            </div>
            <div className="flex items-center gap-2 text-muted-text">
              <span>© {currentYear} Fundamental Foundation.</span>
              <span>Built with</span>
              <Heart className="w-4 h-4 text-secondary" />
              <span>on</span>
              <a
                href="https://solana.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:text-secondary transition-colors flex items-center gap-1"
              >
                Solana
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};