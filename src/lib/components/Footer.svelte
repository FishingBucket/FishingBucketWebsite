<script lang="ts">
    import { resolve } from '$app/paths';
    import favicon from '$lib/assets/favicon.png';
    import { CONFIG_PUBLIC } from '$lib/config';
</script>

<footer class="footer">
    <div class="footer-container">
        <div class="footer-section">
            <div class="footer-brand">
                <img src={favicon} alt="Fishing Bucket" class="footer-avatar" />
                <h3>Fishing Bucket</h3>
            </div>
            <p>The Fluxer bot for proxying messages with style and flexibility.</p>
        </div>

        <div class="footer-section">
            <h4>Recommended</h4>
            <ul>
                <li><a href={resolve('/')}>Home</a></li>
                <li><a href={resolve('/contact')}>Contact</a></li>
            </ul>
        </div>

        <div class="footer-section">
            <h4>Links</h4>
            <ul>
                <li>
                    <a
                        href={CONFIG_PUBLIC.fluxer.guild}
                        target="_blank"
                        rel="noopener noreferrer external">Support Community</a
                    >
                </li>
                <li>
                    <a
                        href={CONFIG_PUBLIC.fluxer.invite}
                        target="_blank"
                        rel="noopener noreferrer external">Invite Bot</a
                    >
                </li>
                <li>
                    <a
                        href={CONFIG_PUBLIC.github}
                        target="_blank"
                        rel="noopener noreferrer external">GitHub</a
                    >
                </li>
            </ul>
        </div>

        <div class="footer-section">
            <h4>Legal</h4>
            <ul>
                <li><a href={resolve('/privacy')}>Privacy Policy</a></li>
                <li><a href={resolve('/terms')}>Terms of Service</a></li>
                <li><a href={resolve('/copyright')}>Copyright</a></li>
            </ul>
        </div>
    </div>

    <div class="footer-bottom">
        <p><a href={resolve('/copyright')}>© 2026 Fishing Bucket</a></p>
        <p>Made with ♥ by the Fishing Bucket Team</p>
    </div>
</footer>

<style>
    .footer {
        background-color: var(--background-secondary);
        border-top: 1px solid var(--border-color);
        padding: 3rem 2rem 1.5rem;
        margin-top: auto;
    }

    .footer-container {
        max-width: 1400px;
        margin: 0 auto;
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 2rem;
        margin-bottom: 2rem;
    }

    .footer-brand {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        margin-bottom: 0.75rem;
    }

    .footer-avatar {
        width: 40px;
        height: 40px;
        border-radius: 8px;
    }

    .footer-section h3 {
        font-size: 1.25rem;
        font-weight: 700;
        margin-bottom: 0.75rem;
        color: var(--text-primary);
    }

    .footer-section h4 {
        font-size: 1rem;
        font-weight: 600;
        margin-bottom: 0.75rem;
        color: var(--text-primary);
    }

    .footer-section p {
        color: var(--text-secondary);
        font-size: 0.9rem;
        line-height: 1.6;
        margin: 0;
    }

    .footer-section ul {
        list-style: none;
        padding: 0;
        margin: 0;
    }

    .footer-section li {
        margin-bottom: 0.5rem;
    }

    .footer-section a {
        color: var(--text-secondary);
        text-decoration: none;
        font-size: 0.9rem;
    }

    .footer-section a:hover {
        color: var(--accent-primary);
    }

    .footer-bottom {
        max-width: 1400px;
        margin: 0 auto;
        padding-top: 1.5rem;
        border-top: 1px solid var(--border-color);
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-wrap: wrap;
        gap: 0.5rem;
    }

    .footer-bottom p {
        color: var(--text-muted);
        font-size: 0.85rem;
        margin: 0;
    }

    @media (max-width: 768px) {
        .footer {
            padding: 2rem 1rem 1rem;
        }

        .footer-container {
            grid-template-columns: 1fr;
            gap: 1.5rem;
        }

        .footer-bottom {
            flex-direction: column;
            text-align: center;
        }
    }
</style>
