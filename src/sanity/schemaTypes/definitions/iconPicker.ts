import { defineType } from "sanity";

export const iconPicker = defineType({
  name: "iconPicker",
  title: "Icon Picker",
  type: "string",
  options: {
    list: [
      // Common UI icons
      { title: "Home", value: "home" },
      { title: "Search", value: "search" },
      { title: "Menu", value: "menu" },
      { title: "Settings", value: "settings" },
      { title: "User", value: "user" },

      // Action icons
      { title: "Plus", value: "plus" },
      { title: "Minus", value: "minus" },
      { title: "Check", value: "check" },
      { title: "X (Close)", value: "x" },

      // Communication icons
      { title: "Mail", value: "mail" },
      { title: "Phone", value: "phone" },
      { title: "Message", value: "message" },
      { title: "Chat", value: "chat" },

      // Content icons
      { title: "Document", value: "document" },
      { title: "File", value: "file" },
      { title: "Folder", value: "folder" },
      { title: "Image", value: "image" },

      // Financial icons
      { title: "Dollar", value: "dollar" },
      { title: "Credit Card", value: "credit-card" },
      { title: "Wallet", value: "wallet" },
      { title: "Bank", value: "bank" },

      // Navigation icons
      { title: "Arrow Right", value: "arrow-right" },
      { title: "Arrow Left", value: "arrow-left" },
      { title: "Arrow Up", value: "arrow-up" },
      { title: "Arrow Down", value: "arrow-down" },

      // Social icons
      { title: "Share", value: "share" },
      { title: "Link", value: "link" },
      { title: "Globe", value: "globe" },

      // Financial service specific
      { title: "Chart", value: "chart" },
      { title: "Pie Chart", value: "pie-chart" },
      { title: "Bar Chart", value: "bar-chart" },
      { title: "Calculator", value: "calculator" },
      { title: "Briefcase", value: "briefcase" },
      { title: "Shield", value: "shield" },
      { title: "Target", value: "target" },
      { title: "Growth", value: "trending-up" },
      { title: "Decline", value: "trending-down" },
    ],
  },
});
