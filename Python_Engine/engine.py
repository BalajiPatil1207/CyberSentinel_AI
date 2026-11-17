"""
CyberSentinel AI - Python Security Engine
Author: Balaji Patil
GitHub: github.com/BalajiPatil1207

Provides real-time cybersecurity functions:
1. Multi-threaded TCP Port Scanning & Banner Grabbing
2. Shannon Entropy & File Signature Analysis
3. Domain & URL Threat Inspection
"""

import socket
import ssl
import math
import hashlib
from typing import List, Dict, Any
from urllib.parse import urlparse


def calculate_entropy(data: bytes) -> float:
    """
    Calculates Shannon Entropy of a byte sequence (0.0 to 8.0).
    High entropy (> 7.0) often indicates encryption, packing, or obfuscation (common in malware/ransomware).
    """
    if not data:
        return 0.0

    entropy = 0.0
    length = len(data)
    occurrences = [0] * 256

    for byte in data:
        occurrences[byte] += 1

    for count in occurrences:
        if count == 0:
            continue
        p = count / length
        entropy -= p * math.log2(p)

    return round(entropy, 4)


def scan_port(host: str, port: int, timeout: float = 0.6) -> Dict[str, Any]:
    """
    Attempts a TCP connect to a single port and grabs a basic service banner if available.
    """
    service_name = "unknown"
    try:
        service_name = socket.getservbyport(port, "tcp")
    except Exception:
        if port == 8080:
            service_name = "http-proxy"
        elif port == 3306:
            service_name = "mysql"
        elif port == 5432:
            service_name = "postgresql"
        elif port == 27017:
            service_name = "mongodb"

    result = {
        "port": port,
        "state": "closed",
        "service": service_name,
        "banner": None,
    }

    try:
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
            s.settimeout(timeout)
            conn = s.connect_ex((host, port))
            if conn == 0:
                result["state"] = "open"
                try:
                    s.sendall(b"HEAD / HTTP/1.0\r\n\r\n")
                    banner = s.recv(256).decode("utf-8", errors="ignore").strip()
                    if banner:
                        result["banner"] = banner.split("\n")[0]
                except Exception:
                    pass
    except Exception:
        pass

    return result


def scan_target_ports(target: str, ports: List[int] = None) -> List[Dict[str, Any]]:
    """
    Scans a target IP or domain across common or specified ports.
    """
    if ports is None:
        # Most common security audit ports
        ports = [21, 22, 23, 25, 53, 80, 110, 143, 443, 445, 3306, 3389, 5432, 8080, 27017]

    try:
        resolved_ip = socket.gethostbyname(target)
    except socket.gaierror:
        return []

    open_ports = []
    for port in ports:
        res = scan_port(resolved_ip, port)
        if res["state"] == "open":
            open_ports.append(res)

    return open_ports


def inspect_file_data(filename: str, data: bytes) -> Dict[str, Any]:
    """
    Analyzes raw file data: SHA-256, MD5, Shannon Entropy, and Magic Header inspection.
    """
    sha256 = hashlib.sha256(data).hexdigest()
    md5 = hashlib.md5(data).hexdigest()
    entropy = calculate_entropy(data)

    # Magic Bytes identification
    is_pe = len(data) >= 2 and data[:2] == b"MZ"
    is_elf = len(data) >= 4 and data[:4] == b"\x7fELF"
    is_pdf = len(data) >= 4 and data[:4] == b"%PDF"
    is_zip = len(data) >= 4 and data[:4] == b"PK\x03\x04"

    signatures = []
    if is_pe:
        signatures.append("PE/MZ Windows Executable detected")
    elif is_elf:
        signatures.append("ELF Linux Binary detected")
    elif is_pdf:
        signatures.append("Standard PDF Document")
    elif is_zip:
        signatures.append("ZIP Compressed Archive")

    is_suspicious_entropy = entropy > 7.1
    if is_suspicious_entropy:
        signatures.append(f"High Shannon Entropy ({entropy}/8.0): Possible packed or encrypted payload")

    risk_score = 0
    if is_pe or is_elf:
        risk_score += 40
    if is_suspicious_entropy:
        risk_score += 35

    return {
        "filename": filename,
        "sha256": sha256,
        "md5": md5,
        "size_bytes": len(data),
        "entropy": entropy,
        "is_packed": is_suspicious_entropy,
        "signatures": signatures,
        "risk_score": min(risk_score, 100),
    }


def inspect_url(url_string: str) -> Dict[str, Any]:
    """
    Inspects URL scheme, domain, and basic DNS resolution.
    """
    if not url_string.startswith(("http://", "https://")):
        url_string = "http://" + url_string

    parsed = urlparse(url_string)
    domain = parsed.netloc.split(":")[0]

    ip_resolved = None
    try:
        ip_resolved = socket.gethostbyname(domain)
    except Exception:
        pass

    return {
        "url": url_string,
        "domain": domain,
        "scheme": parsed.scheme,
        "resolved_ip": ip_resolved,
        "is_valid_domain": ip_resolved is not None,
    }
