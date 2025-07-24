#!/bin/bash
set -e

REPO_URL="https://github.com/orus-dev/sentryx.git"
INSTALL_DIR="$HOME/sentryx"  # expanded
SERVICE_NAME="sentryx"
SERVICE_FILE="/etc/systemd/system/$SERVICE_NAME.service"
NODE_BIN="$(which node)"
RUN_USER="$(whoami)"  # change if needed

# Backup if exists
if [ -d "$INSTALL_DIR" ]; then
    echo "Sentryx already exists, backing up..."
    rm -rf "$INSTALL_DIR-backup"
    mv "$INSTALL_DIR" "$INSTALL_DIR-backup"
fi

# Clone as current user
git clone "$REPO_URL" "$INSTALL_DIR"

# Build as current user inside INSTALL_DIR
cd $INSTALL_DIR
npm install
npm run build

# Create systemd service file with absolute ExecStart path
echo "Creating systemd service..."
sudo tee "$SERVICE_FILE" > /dev/null <<EOF
[Unit]
Description=SentryX Server
After=network.target

[Service]
Type=simple
User=$RUN_USER
WorkingDirectory=$INSTALL_DIR
ExecStart=$NODE_BIN "$INSTALL_DIR/node_modules/.bin/next" start
Restart=on-failure
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target
EOF

# Reload systemd and enable service
sudo systemctl daemon-reload
sudo systemctl enable --now "$SERVICE_NAME.service"

echo "Done! Check service with: sudo systemctl status $SERVICE_NAME"
