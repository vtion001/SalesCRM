#!/bin/bash

# Apply Security Migration Script
# This script helps you apply the RLS security migration

echo "🔒 SalesCRM Security Migration Applier"
echo "======================================="
echo ""

MIGRATION_FILE="supabase/migrations/20250127000002_secure_rls_policies.sql"

if [ ! -f "$MIGRATION_FILE" ]; then
    echo "❌ Error: Migration file not found!"
    exit 1
fi

echo "✅ Migration file found: $MIGRATION_FILE"
echo ""
echo "📋 Choose your method:"
echo ""
echo "1. Open Supabase Dashboard (Recommended)"
echo "2. Show migration file location"
echo "3. Display first 50 lines of migration"
echo "4. Count total lines"
echo ""
read -p "Enter your choice (1-4): " choice

case $choice in
    1)
        echo ""
        echo "🌐 Opening Supabase SQL Editor in browser..."
        echo ""
        echo "Next steps:"
        echo "  1. Open the migration file in VS Code"
        echo "  2. Select all (Cmd+A) and copy (Cmd+C)"
        echo "  3. Paste into the SQL Editor"
        echo "  4. Click 'Run' button"
        echo ""
        open "https://supabase.com/dashboard/project/isdogcsgykvplppezpos/sql/new"
        ;;
    2)
        echo ""
        echo "📁 Migration file location:"
        echo "$(pwd)/$MIGRATION_FILE"
        echo ""
        echo "Open this file in VS Code and copy its contents."
        ;;
    3)
        echo ""
        echo "📄 First 50 lines of migration:"
        echo "================================"
        head -50 "$MIGRATION_FILE"
        echo ""
        echo "... (showing first 50 of $(wc -l < "$MIGRATION_FILE" | tr -d ' ') total lines)"
        ;;
    4)
        echo ""
        echo "📊 Migration file statistics:"
        echo "  Total lines: $(wc -l < "$MIGRATION_FILE" | tr -d ' ')"
        echo "  Total size: $(wc -c < "$MIGRATION_FILE" | tr -d ' ') bytes"
        ;;
    *)
        echo ""
        echo "❌ Invalid choice. Please run the script again."
        exit 1
        ;;
esac

echo ""
echo "✅ Ready to apply migration!"
