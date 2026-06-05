export interface AppConfigExport {
  // 是否启用CDN
  enableCDN: boolean;
  // 标题
  title?: string;

  copyright?: string;
}

export const config: AppConfigExport = {
  // 是否启用CDN
  enableCDN: false,
  title: "X-Front Template",
  copyright: "Copyright © 2026-XXX.",
};
